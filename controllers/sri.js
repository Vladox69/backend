const { response } = require("express");
const Sale = require("../models/Sale");
const downloadFileFromUrl = require("../helpers/downloadFileFromUrl");
const { parseStringPromise } = require("xml2js");
const axios = require("axios");

const receptionXML = async (req, res = response) => {
  const { id } = req.params;

  try {
    // 1. Buscar la venta
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ ok: false, message: "Sale not found" });
    }

    // 2. Descargar XML desde Cloudinary
    const XMLBuffer = await downloadFileFromUrl(sale.invoiceUrl);

    // 3. Convertir a base64 para enviar al SRI
    const XMLBase64 = Buffer.from(XMLBuffer, "utf-8").toString("base64");

    // 4. Construir el SOAP
    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.recepcion">
        <soapenv:Header/>
        <soapenv:Body>
          <ec:validarComprobante>
            <xml>${XMLBase64}</xml>
          </ec:validarComprobante>
        </soapenv:Body>
      </soapenv:Envelope>
    `.trim();

    // 5. Enviar al WebService de recepción del SRI (ambiente de pruebas)
    const sriResponse = await axios.post(
      "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl",
      soapEnvelope,
      {
        headers: {
          "Content-Type": "text/xml;charset=utf-8",
          Accept: "text/xml",
        },
        timeout: 20000,
      }
    );

    // 6. Parsear XML de respuesta
    const parsed = await parseStringPromise(sriResponse.data, {
      explicitArray: false,
    });

    const body = parsed["soap:Envelope"]?.["soap:Body"];
    const responseKey = Object.keys(body || {}).find((key) =>
      key.endsWith(":validarComprobanteResponse")
    );
    const respuesta = body?.[responseKey]?.RespuestaRecepcionComprobante;

    if (!respuesta) {
      throw new Error("Unexpected response from the SRI");
    }

    // 7. Si está devuelto, devolver errores
    if (respuesta.estado === "DEVUELTA") {
      const errores =
        respuesta.comprobantes?.comprobante?.mensajes?.mensaje || [];

      return res.status(400).json({
        ok: false,
        estado: "DEVUELTA",
        errores: Array.isArray(errores) ? errores : [errores],
      });
    }

    // 8. Devuelto exitoso
    return res.json({
      ok: true,
      estado: respuesta.estado,
      sriResponse: respuesta,
    });
  } catch (error) {
    console.error("Error in receptionXML:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error in receiving XML",
      error: error.message,
    });
  }
};

const authorizeXML = async (req, res = response) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ ok: false, message: "Sale not found" });
    }

    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.autorizacion">
        <soapenv:Header/>
        <soapenv:Body>
          <ec:autorizacionComprobante>
            <claveAccesoComprobante>${sale.accessKey}</claveAccesoComprobante>
          </ec:autorizacionComprobante>
        </soapenv:Body>
      </soapenv:Envelope>
    `.trim();

    const response = await axios.post(
      "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl",
      soapEnvelope,
      {
        headers: {
          "Content-Type": "text/xml;charset=utf-8",
          Accept: "text/xml",
        },
        timeout: 20000,
      }
    );

    const parsed = await parseStringPromise(response.data, {
      explicitArray: false,
    });
    const body = parsed["soap:Envelope"]?.["soap:Body"];
    const responseKey = Object.keys(body || {}).find((key) =>
      key.endsWith(":autorizacionComprobanteResponse")
    );

    const autorizacion =
      body?.[responseKey]?.RespuestaAutorizacionComprobante?.autorizaciones
        ?.autorizacion;

    if (!autorizacion) {
      throw new Error("El SRI no devolvió información de autorización.");
    }

    return res.json({
      ok: true,
      estado: autorizacion.estado,
      fechaAutorizacion: autorizacion.fechaAutorizacion || null,
      numeroAutorizacion: autorizacion.numeroAutorizacion || null,
      mensaje: autorizacion.mensajes?.mensaje || [],
    });
  } catch (error) {
    return res.json({
      ok: false,
      error: error.message,
    });
  }
};

module.exports = {
  receptionXML,
  authorizeXML,
};

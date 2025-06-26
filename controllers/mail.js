const { response } = require("express");
const Sale = require("../models/Sale");
const nodemailer = require("nodemailer");
const getInvoiceHTML = require("../helpers/getInvoiceHTML");
const downloadAuthenticatedFile = require("../helpers/downloadAuthenticatedFile");

const sendMail = async (req, res = response) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id)
      .populate("customer")
      .populate("location");

    if (!sale) {
      return res.status(404).json({ msg: "Sale not found" });
    }
    const htmlContent = getInvoiceHTML({
      businessName: sale.location.name,
      customerName: sale.customer.fullName,
      total: sale.totalAmount.toFixed(2),
      documentNumber: `${sale.location.code}${sale.location.emissionPoint}${sale.sequential}`,
    });

    const pdfBuffer = await downloadAuthenticatedFile(
      `facturas/factura_${sale.accessKey}.pdf`,
      "raw",
      "pdf"
    );
    const xmlBuffer = await downloadAuthenticatedFile(
      `facturas/factura_${sale.accessKey}.xml`,
      "raw",
      "xml"
    );
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sale.customer.email,
      subject: `Factura electrónica - ${sale.location.name}`,
      html: htmlContent,
      attachments: [
        {
          filename: `factura_${sale.accessKey}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
        {
          filename: `factura_${sale.accessKey}.xml`,
          content: xmlBuffer,
          contentType: "application/xml",
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error sending email" });
  }
};

const downloadFile = async (req, res = response) => {
  try {
    const { accessKey, format = "pdf" } = req.body;

    // Validaciones básicas
    const allowedFormats = ["pdf", "xml"];
    if (!allowedFormats.includes(format)) {
      return res.status(400).json({ msg: "Formato no permitido" });
    }

    if (!/^[\w\-]+$/.test(accessKey)) {
      return res.status(400).json({ msg: "AccessKey inválido" });
    }

    const fileBuffer = await downloadAuthenticatedFile(
      `facturas/factura_${accessKey}.${format}`,
      "raw",
      format
    );

    const mimeTypes = {
      pdf: "application/pdf",
      xml: "application/xml",
    };

    res.set({
      "Content-Type": mimeTypes[format],
      "Content-Disposition": `attachment; filename=factura_${accessKey}.${format}`,
    });

    res.send(fileBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error downloading file" });
  }
};


module.exports = {
  sendMail,
  downloadFile
};

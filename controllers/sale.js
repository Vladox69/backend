const { response } = require("express");
const mongoose = require("mongoose");
const { create } = require("xmlbuilder2");
const cloudinary = require("../db/cloudinary");
const uploadToCloudinary = require("../helpers/uploadToCloudinary");
const Sale = require("../models/Sale");
const Business = require("../models/Business");
const Location = require("../models/Location");
const Customer = require("../models/Customer");
const CustomerType = require("../models/CustomerType");
const Product = require("../models/Product");
const SaleDetail = require("../models/SaleDetail");
const TaxDetail = require("../models/TaxDetail");
const TaxRate = require("../models/TaxRate");
const PaymentDetail = require("../models/PaymentDetail");
const PaymentMethod = require("../models/PaymentMethod");
const { signXml } = require("../helpers/signXml");

const { generateAccessKey } = require("../helpers/generateAccessKey");

const createSale = async (req, res = response) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json({
      ok: true,
      sale,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error creating sale" });
  }
};

const getSales = async (req, res = response) => {
  try {
    const sales = await Sale.find()
      .populate("location", "name")
      .populate("customer", "fullName");

    res.status(200).json({
      ok: true,
      sales,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ ok: false, message: "Error fetching sales" });
  }
};

const getSaleById = async (req, res = response) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ ok: false, message: "Sale not found" });
    }
    res.status(200).json({ ok: true, sale });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error fetching sale" });
  }
};

const updateSale = async (req, res = response) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ ok: false, message: "Sale not found" });
    }
    const updatedSale = await Sale.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSale) {
      return res
        .status(400)
        .json({ ok: false, message: "Error updating sale" });
    }
    res.status(200).json({ ok: true, sale: updatedSale });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error updating sale" });
  }
};

const deleteSale = async (req, res = response) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ ok: false, message: "Sale not found" });
    }
    await Sale.findByIdAndDelete(id);
    res.status(200).json({ ok: true, message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error deleting sale" });
  }
};

const generateInvoice = async (req, res = response) => {
  const session = await mongoose.startSession();
  let customerId;
  session.startTransaction();
  try {
    const { customer, sale, saleDetails, paymentDetails } = req.body;
    if (customer.identificationType.description != "VENTA A CONSUMIDOR FINAL") {
      const findCustomer = await Customer.findOne({
        identification: customer.identification,
      }).session(session);
      if (findCustomer) {
        customerId = findCustomer._id;
      } else {
        const newCustomer = new Customer(customer);
        const savedCustomer = await newCustomer.save({ session });
        customerId = savedCustomer._id;
      }
    } else {
      customerId = customer._id;
    }
    const newSale = new Sale({
      ...sale,
      customer: customerId,
    });
    const savedSale = await newSale.save({ session });
    for (const detail of saleDetails) {
      const newSaleDetail = new SaleDetail({
        ...detail,
        sale: savedSale._id,
      });
      await newSaleDetail.save({ session });
      detail._id = newSaleDetail._id;
    }

    for (const detail of saleDetails) {
      const newTaxDetailIVA = new TaxDetail({
        tax: detail.tax,
        saleDetail: detail._id,
        unitPriceWithoutTax: detail.unitPriceWithoutTax,
        unitPriceWithTax: detail.unitPriceWithTax,
        totalPriceWithoutTax: detail.totalPriceWithoutTax,
        totalPriceWithTax: detail.totalPriceWithTax,
      });
      await newTaxDetailIVA.save({ session });
    }

    for (const paymentDetail of paymentDetails) {
      const newPaymentDetail = new PaymentDetail({
        ...paymentDetail,
        sale: savedSale._id,
      });
      await newPaymentDetail.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json({
      ok: true,
      sale: savedSale,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const updateInvoiceMetadata = async (req, res = response) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id);
    if (sale.sequential != "not") {
      return res.status(400).json({
        ok: false,
        message: "Sale already has a sequential number",
      });
    }
    const location = await Location.findById(sale.location);
    const business = await Business.findById(location.business);
    const result = await Sale.aggregate([
      {
        $match: {
          location: location._id,
        },
      },
      {
        $addFields: {
          seqInt: {
            $convert: {
              input: "$sequential",
              to: "int",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $sort: { seqInt: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    const last = result[0]?.seqInt || 0;
    const next = String(last + 1).padStart(9, "0");
    const accessKey = generateAccessKey(next, location, business);
    const urlInvoice = `${process.env.URL_INVOICE}/${accessKey}`;
    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      {
        $set: {
          sequential: next,
          accessKey,
          invoiceUrl: urlInvoice,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      ok: true,
      sale: updatedSale,
    });
  } catch (error) {
    console.log("Error updating sale metadata:", error);
    res.status(500).json({
      ok: false,
      message: "Error updating sale metadata",
    });
  }
};

const generateXmlInvoice = async (req, res = response) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id)
      .populate({
        path: "customer",
        populate: { path: "identificationType", model: CustomerType },
      })
      .populate("location");
    const business = await Business.findById(sale.location.business).populate(
      "environmentType"
    );
    const saleDetails = await SaleDetail.find({ sale: sale._id }).populate({
      path: "product",
      populate: ["iva", "ice"],
    });
    const taxDetails = await TaxDetail.find({
      saleDetail: { $in: saleDetails.map((d) => d._id) },
    })
      .populate({
        path: "tax",
        populate: { path: "tax" },
      })
      .populate("saleDetail");
    const paymentDetails = await PaymentDetail.find({
      sale: sale._id,
    }).populate("paymentMethod");
    const fechaEmision = new Intl.DateTimeFormat("es-EC", {
      timeZone: "America/Guayaquil", // Asegura hora de Ecuador
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(sale.issueDate));
    // CREAR XML
    const doc = create({ version: "1.0", encoding: "UTF-8" }).ele("factura", {
      id: "comprobante",
      version: "1.1.0",
    });

    const infoTributaria = doc.ele("infoTributaria");
    infoTributaria.ele("ambiente").txt(business.environmentType.code);
    infoTributaria.ele("tipoEmision").txt("1");
    infoTributaria.ele("razonSocial").txt(business.businessName);
    infoTributaria.ele("nombreComercial").txt(business.tradeName);
    infoTributaria.ele("ruc").txt(business.taxId);
    infoTributaria.ele("claveAcceso").txt(sale.accessKey);
    infoTributaria.ele("codDoc").txt("01");
    infoTributaria.ele("estab").txt(sale.location.code);
    infoTributaria.ele("ptoEmi").txt(sale.location.emissionPoint);
    infoTributaria.ele("secuencial").txt(sale.sequential);
    infoTributaria.ele("dirMatriz").txt(sale.location.address);

    const infoFactura = doc.ele("infoFactura");
    infoFactura.ele("fechaEmision").txt(fechaEmision);
    infoFactura
      .ele("obligadoContabilidad")
      .txt(business.accountingRequired ? "SI" : "NO");
    infoFactura
      .ele("tipoIdentificacionComprador")
      .txt(sale.customer.identificationType.code);
    infoFactura.ele("razonSocialComprador").txt(sale.customer.fullName);
    infoFactura
      .ele("identificacionComprador")
      .txt(sale.customer.identification);
    infoFactura.ele("direccionComprador").txt(sale.customer.address || "S/N");
    infoFactura.ele("totalSinImpuestos").txt(sale.totalWithoutTaxes.toFixed(2));
    infoFactura.ele("totalDescuento").txt(sale.totalDiscount.toFixed(2));

    const impuestosAgrupados = {};

    taxDetails.forEach((taxDetail) => {
      const taxId = taxDetail.tax._id.toString();

      if (!impuestosAgrupados[taxId]) {
        impuestosAgrupados[taxId] = {
          tax: taxDetail.tax,
          baseImponible: 0,
          valor: 0,
        };
      }

      impuestosAgrupados[taxId].baseImponible += taxDetail.totalPriceWithoutTax;
      impuestosAgrupados[taxId].valor +=
        taxDetail.totalPriceWithTax - taxDetail.totalPriceWithoutTax;
    });

    const totalConImpuestos = infoFactura.ele("totalConImpuestos");
    Object.values(impuestosAgrupados).forEach((imp) => {
      totalConImpuestos
        .ele("totalImpuesto")
        .ele("codigo")
        .txt(imp.tax.tax.code) 
        .up()
        .ele("codigoPorcentaje")
        .txt(imp.tax.code) 
        .up()
        .ele("baseImponible")
        .txt(imp.baseImponible.toFixed(2))
        .up()
        .ele("valor")
        .txt(imp.valor.toFixed(2));
    });

    infoFactura.ele("propina").txt("0.00");
    infoFactura.ele("importeTotal").txt(sale.totalAmount.toFixed(2));
    infoFactura.ele("moneda").txt("USD");

    const pagos = infoFactura.ele("pagos");
    paymentDetails.forEach((pd) => {
      pagos
        .ele("pago")
        .ele("formaPago")
        .txt(pd.paymentMethod.code)
        .up()
        .ele("total")
        .txt(pd.value.toFixed(2));
    });
    infoFactura.ele("valorRetIva").txt("0.00");
    infoFactura.ele("valorRetRenta").txt("0.00");

    const detalles = doc.ele("detalles");
    for (const detail of saleDetails) {
      const detalle = detalles.ele("detalle");
      detalle.ele("codigoPrincipal").txt(detail.product._id.toString());
      detalle.ele("codigoAuxiliar").txt(detail.product._id.toString());
      detalle.ele("descripcion").txt(detail.product.name);
      detalle.ele("cantidad").txt(detail.quantity.toString());
      detalle.ele("precioUnitario").txt(detail.unitValue.toFixed(2));
      detalle.ele("descuento").txt("0.00");
      detalle
        .ele("precioTotalSinImpuesto")
        .txt(detail.valueWithoutTaxes.toFixed(2));

      const impuestos = detalle.ele("impuestos");
      const relatedTaxes = taxDetails.filter(
        (td) => td.saleDetail._id.toString() === detail._id.toString()
      );
      relatedTaxes.forEach((td) => {
        impuestos
          .ele("impuesto")
          .ele("codigo")
          .txt(td?.tax?.tax?.code || "2")
          .up()
          .ele("codigoPorcentaje")
          .txt(td?.tax?.code || "0")
          .up()
          .ele("tarifa")
          .txt((td.tax.percentage * 100).toFixed(0))
          .up()
          .ele("baseImponible")
          .txt(td.totalPriceWithoutTax.toFixed(2))
          .up()
          .ele("valor")
          .txt((td.totalPriceWithTax - td.totalPriceWithoutTax).toFixed(2));
      });
    }

    const xmlString = doc.end({ prettyPrint: false }).toString().trim();
    const certUrl =
      "https://calidad.atiendo.ec/eojgprlg/Certificados/11578175_identity_1803480399.p12";
    /*const publicId = "cert/11578175_identity_1803480399.p12";
    const signedUrl = cloudinary.utils.private_download_url(publicId, "raw", {
      expires_at: Math.floor(Date.now() / 1000) + 60 * 5, 
    });*/
    const p12Password = process.env.PASS_CERT;
    const xmlFirmado = await signXml(certUrl, p12Password, xmlString);
    // Subida a Cloudinary
    const result = await uploadToCloudinary(
      xmlFirmado,
      "facturas",
      `factura_${sale.accessKey}`,
      "xml"
    );
    // Actualizar la venta con la URL del XML firmado
    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      { invoiceUrl: result.secure_url },
      { new: true }
    );
    res.status(200).json({
      ok: true,
      message: "Invoice generated, signed and uploaded correctly",
      sale: updatedSale,
    });
  } catch (error) {
    console.error("Error generating and signing XML:", error);
    res.status(500).json({ ok: false, message: "Error generating signed XML" });
  }
};

const getSalesByBusiness = async (req, res = response) => {
  const { businessId } = req.params;
  try {
    const locations = await Location.find({ business: businessId });
    const locationIds = locations.map((loc) => loc._id.toString());
    const sales = await Sale.find({ location: { $in: locationIds } })
      .populate("customer", "identification fullName")
      .populate("location", "code emissionPoint");

    if (!sales || sales.length === 0) {
      return res.status(404).json({ ok: false, message: "No sales found" });
    }

    res.status(200).json({
      ok: true,
      sales,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: "Error fetching sales" });
  }
};

const getSalesStatsByBusiness = async (req, res = response) => {
  const { businessId } = req.params;

  try {
    const locations = await Location.find({ business: businessId });
    const locationIds = locations.map(loc => loc._id);

    if (locationIds.length === 0) {
      return res.status(404).json({ ok: false, message: "No locations found for business" });
    }

    const topProducts = await SaleDetail.aggregate([
      {
        $lookup: {
          from: "sales",
          localField: "sale",
          foreignField: "_id",
          as: "saleInfo"
        }
      },
      { $unwind: "$saleInfo" },
      {
        $match: {
          "saleInfo.location": { $in: locationIds }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$product",
          name: { $first: "$productInfo.name" },
          quantitySold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalValue" }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 10 }
    ]);

    const topCustomers = await Sale.aggregate([
      {
        $match: {
          location: { $in: locationIds }
        }
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerInfo"
        }
      },
      { $unwind: "$customerInfo" },
      {
        $group: {
          _id: "$customer",
          name: { $first: "$customerInfo.fullName" },
          identification: { $first: "$customerInfo.identification" },
          totalSpent: { $sum: "$totalAmount" },
          purchaseCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      ok: true,
      topProducts,
      topCustomers
    });

  } catch (error) {
    console.error("Error getting sales stats:", error);
    res.status(500).json({
      ok: false,
      message: "Error fetching statistics"
    });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  generateInvoice,
  updateInvoiceMetadata,
  generateXmlInvoice,
  getSalesByBusiness,
  getSalesStatsByBusiness
};

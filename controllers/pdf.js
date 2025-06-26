const { response } = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
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

const generatePDF = async (req, res = response) => {
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
      timeZone: "America/Guayaquil",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(sale.issueDate));

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const htmlPath = path.join(__dirname, "../views/templates/invoice.html");
    let html = fs.readFileSync(htmlPath, "utf-8");

    // Reemplazos dinámicos
    html = html.replace("{{logoUrl}}", "");
    html = html.replace("{{taxId}}", business.taxId);
    html = html.replace("{{businessName}}", business.businessName);
    html = html.replace("{{tradeName}}", business.tradeName);
    html = html.replace("{{address}}", sale.location.address);
    html = html.replace("{{address2}}", sale.location.address);
    html = html.replace("{{code}}", sale.location.code);
    html = html.replace("{{emissionPoint}}", sale.location.emissionPoint);
    html = html.replace("{{sequential}}", sale.sequential);
    html = html.replace("{{accessKey}}", sale.accessKey);
    html = html.replace("{{codebar}}", ""); // Puedes usar un <img> base64 o URL
    html = html.replace("{{fullName}}", sale.customer.fullName);
    html = html.replace("{{identification}}", sale.customer.identification);
    html = html.replace("{{addressCustomer}}", sale.customer.address);
    html = html.replace("{{fechaEmision}}", fechaEmision);

    html = html.replace(
      "{{saleDetails}}",
      saleDetails
        .map(
          (detail) => `
        <tr>
          <td>${detail.product._id.toString()}</td>
          <td>${detail.product.name}</td>
          <td>${detail.quantity}</td>
          <td>${detail.unitValue.toFixed(2)}</td>
          <td>0.00</td>
          <td>${detail.valueWithoutTaxes.toFixed(2)}</td>
        </tr>
      `
        )
        .join("")
    );

    html = html.replace(
      "{{totalWithoutTaxes}}",
      sale.totalWithoutTaxes.toFixed(2)
    );
    html = html.replace("{{totalAmount}}", sale.totalAmount.toFixed(2));
    html = html.replace("{{totalAmount2}}", sale.totalAmount.toFixed(2));

    html = html.replace(
      "{{paymentDetails}}",
      paymentDetails
        .map(
          (payment) => `
        <tr>
          <td>${payment.paymentMethod.name}</td>
          <td>${payment.value.toFixed(2)}</td>
        </tr>
      `
        )
        .join("")
    );

    // Set content y generar PDF
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    // Subida a Cloudinary
    const result = await uploadToCloudinary(
      pdfBuffer,
      "facturas",
      `factura_${sale.accessKey}`,
      "pdf"
    );

    // Guardar URL PDF en la venta
    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      { approvalUrl: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      ok: true,
      message: "PDF generado y subido correctamente",
      sale: updatedSale,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      ok: false,
      message: "Error generating PDF",
      error: error.message,
    });
  }
};

module.exports = {
  generatePDF,
};

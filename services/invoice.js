const { response } = require("express");
const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Sale = require("../models/Sale");
const SaleDetail = require("../models/SaleDetail");
const TaxDetail = require("../models/TaxDetail");
const PaymentMethod = require("../models/PaymentMethod");

const generateInvoice = async (req, res = response) => {
  const session = await mongoose.startSession();
  let customerId;
  session.startTransaction();
  try {
    const { customerType, customer, sale, saleDetails, paymentMethods } =
      req.body;
    if (customerType != "CONSUMIDOR FINAL") {
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
        tax: detail.iva,
        saleDetail: detail._id,
        unitPriceWithoutTax: detail.unitPriceWithoutTax,
        unitPriceWithTax: detail.unitPriceWithTax,
        totalPriceWithoutTax: detail.totalPriceWithoutTax,
        totalPriceWithTax: detail.totalPriceWithTax,
      });
      await newTaxDetailIVA.save({ session });

      /*const newTaxDetailICE = new TaxDetail({
          tax: detail.ice,
          saleDetail: detail._id,
          unitPriceWithoutTax: detail.unitPriceWithoutTax,
          unitPriceWithTax: detail.unitPriceWithTax,
          totalPriceWithoutTax: detail.totalPriceWithoutTax,
          totalPriceWithTax: detail.totalPriceWithTax,
        });
        await newTaxDetailICE.save({ session });
        const newTaxDetailIRBPNR = new TaxDetail({
          tax: detail.irbpnr,
          saleDetail: detail._id,
          unitPriceWithoutTax: detail.unitPriceWithoutTax,
          unitPriceWithTax: detail.unitPriceWithTax,
          totalPriceWithoutTax: detail.totalPriceWithoutTax,
          totalPriceWithTax: detail.totalPriceWithTax,
        });
        await newTaxDetailIRBPNR.save({ session });*/
    }

    for (const paymentMethod of paymentMethods) {
      const newPaymentMethod = new PaymentMethod({
        ...paymentMethod,
        sale: savedSale._id,
      });
      await newPaymentMethod.save({ session });
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
      message: "Error generating invoice",
    });
  }
};

const generateSequencial = async (req, res = response) => {
  const { establishment, pointOfSale } = req.body;
  try {
    const lastSale = await Sale.findOne({
      establishment,
      pointOfSale,
    })
      .sort({ createdAt: -1 })
      .limit(1);
    let sequencial = 1;
    if (lastSale) {
      sequencial = lastSale.sequencial + 1;
    }
    res.status(200).json({
      ok: true,
      sequencial,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error generating sequencial",
    });
  }
}
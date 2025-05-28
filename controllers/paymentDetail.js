const {response} = require('express');
const PaymentDetail = require('../models/PaymentDetail');

const getPaymentDetails = async (req, res = response) => {
    try {
        const paymentDetails = await PaymentDetail.find()
            .populate('sale', 'invoiceNumber')
            .populate('paymentMethod', 'name');
        res.status(200).json({
            ok: true,
            paymentDetails
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error fetching payment details'
        });
    }
}

const createPaymentDetail = async (req, res = response) => {
    try {
        const paymentDetail = new PaymentDetail(req.body);
        await paymentDetail.save();
        res.status(201).json({
            ok: true,
            paymentDetail
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error creating payment detail'
        });
    }
}


const updatePaymentDetail = async (req, res = response) => {
    const { id } = req.params;
    try {
        const paymentDetail = await PaymentDetail.findById(id);
        if (!paymentDetail) {
            return res.status(404).json({
                ok: false,
                message: 'Payment detail not found'
            });
        }
        const updatedPaymentDetail = await PaymentDetail.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
            ok: true,
            paymentDetail: updatedPaymentDetail
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error updating payment detail'
        });
    }
}

const deletePaymentDetail = async (req, res = response) => {
    const { id } = req.params;
    try {
        const paymentDetail = await PaymentDetail.findByIdAndDelete(id);
        if (!paymentDetail) {
            return res.status(404).json({
                ok: false,
                message: 'Payment detail not found'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Payment detail deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error deleting payment detail'
        });
    }
}

module.exports = {
    getPaymentDetails,
    createPaymentDetail,
    updatePaymentDetail,
    deletePaymentDetail
};
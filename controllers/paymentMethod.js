const {response} = require('express');
const PaymentMethod = require('../models/PaymentMethod');

const getPaymentMethod = async (req, res = response) => {   
    try {
        const paymentMethod = await PaymentMethod.find();
        res.status(200).json({
            ok: true,
            paymentMethod
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error fetching payment methods'
        });
    }
}

const createPaymentMethod = async (req, res = response) => {
    try {
        const paymentMethod = new PaymentMethod(req.body);
        await paymentMethod.save();
        res.status(201).json({
            ok: true,
            paymentMethod
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error creating payment method'
        });
    }
}

const updatePaymentMethod = async (req, res = response) => {
    const { id } = req.params;
    try {
        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(404).json({
                ok: false,
                message: 'Payment method not found'
            });
        }
        const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
            ok: true,
            paymentMethod: updatedPaymentMethod
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error updating payment method'
        });
    }
}

const deletePaymentMethod = async (req, res = response) => {
    const { id } = req.params;
    try {
        const paymentMethod = await PaymentMethod.findByIdAndDelete(id);
        if (!paymentMethod) {
            return res.status(404).json({
                ok: false,
                message: 'Payment method not found'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Payment method deleted'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error deleting payment method'
        });
    }
}

module.exports = {
    getPaymentMethod,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
}
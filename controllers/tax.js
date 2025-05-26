const {response} = require('express');
const Tax = require('../models/Tax');

const getTax = async (req, res = response) => {
    try {
        const tax = await Tax.find();
        res.status(200).json({
            ok: true,
            tax
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error fetching tax'
        });
    }
}

const createTax = async (req, res = response) => {
    try {
        const tax = new Tax(req.body);
        await tax.save();
        res.status(201).json({
            ok: true,
            tax
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error creating tax'
        });
    }
}

const updateTax = async (req, res = response) => {
    const { id } = req.params;
    try {
        const tax = await Tax.findById(id);
        if (!tax) {
            return res.status(404).json({
                ok: false,
                message: 'Tax not found'
            });
        }
        const updatedTax = await Tax.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
            ok: true,
            tax: updatedTax
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error updating tax'
        });
    }
}

const deleteTax = async (req, res = response) => {
    const { id } = req.params;
    try {
        const tax = await Tax.findByIdAndDelete(id);
        if (!tax) {
            return res.status(404).json({
                ok: false,
                message: 'Tax not found'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Tax deleted'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error deleting tax'
        });
    }
}

module.exports = {
    getTax,
    createTax,
    updateTax,
    deleteTax
}
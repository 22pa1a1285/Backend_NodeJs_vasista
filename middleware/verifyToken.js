const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();
const Secretkey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }
    try {
        const decoded = jwt.verify(token, Secretkey);
        const foundVendor = await Vendor.findById(decoded.vendorId);
        if (!foundVendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        req.vendorId = foundVendor._id;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        } else {
            console.error(error);
            return res.status(500).json({ error: "Invalid token" });
        }
    }
};

module.exports = verifyToken;

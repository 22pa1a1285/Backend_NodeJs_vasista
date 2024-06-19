const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vendorfound = await Vendor.findById(req.vendorId);
        if (!vendorfound) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const firm = new Firm({
            firmName, area, category, region, offer, image, vendor: vendorfound._id
        });

        const savedFirm = await firm.save();

        vendorfound.firm.push(savedFirm._id); // Push the savedFirm's _id into vendor's firm array
        await vendorfound.save();

        return res.status(200).json({ message: "Firm added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal server error");
    }
};
const deleteFirmById = async(req,res)=>{
    try {
          const firmId = req.params.firmId;

          const deleteProduct = await Firm.findByIdAndDelete(FirmId);

          if(!deleteProduct){
                 return res.status(404).json({error: "no product found"})
          }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "internal server error"})
        
    }
}
module.exports = { addFirm: [upload.single('image'), addFirm],deleteFirmById };

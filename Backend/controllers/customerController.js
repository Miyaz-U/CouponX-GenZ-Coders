const Customer = require("../models/Customer");


const getCustomers = async (req, res) => {

    try {

        const customers =
            await Customer.find()
                .sort({
                    createdAt: -1
                });

        res.json({

            success: true,

            data: customers

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


module.exports = {
    getCustomers
};
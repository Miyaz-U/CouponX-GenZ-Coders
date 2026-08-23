const Order = require("../models/order");


const getOrders = async (req, res) => {

    try {

        const orders =
            await Order.find()
                .populate(
                    "customer",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });

        res.json({

            success: true,

            data: orders

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


module.exports = {
    getOrders
};  
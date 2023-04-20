const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const User = require('../../models/User');
const Product = require('../../models/Product');

const formatDate= (date) => {
    let newDate = new Date(date);
    let formattedDate = newDate.toLocaleDateString();
    let formattedTime = newDate.toLocaleTimeString();
    return formattedDate + " " + formattedTime;
}

const OrderController = {
    getOrders: async(req, res) => {
        try {
            const options = {
                page: req.query.page || 1, 
                limit: 12, 
                sort: { createdAt: -1 }
            };
            const searchQuery = req.query.search || '';
    
            const query = {
                $or: [
                    { 'status': { $regex: searchQuery, $options: 'i' } },
                ],
            };
            // format data

            const orders = await Order.paginate(query, options);
            const newOrder = orders.docs.map(order => {
                let statusView;
                if (order.status.toLowerCase() === 'pending') {
                    statusView = 'label-warning';
                } else if (order.status.toLowerCase() === 'done') {
                    statusView = 'label-success';
                } else if (order.status.toLowerCase() === 'cancelled'){
                    statusView = 'label-danger';
                }else{
                    statusView = 'label-info';
                }

                return {
                    id: order._id,
                    userId: order.userId,
                    products: order.products,
                    userProfile: order.userProfile,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    statusView: statusView,
                    createdAt: formatDate(order.createdAt),
                    updatedAt: formatDate(order.updatedAt),
                }
            });
            // return res.send(newOrder);
            return res.render('admin/order', {newOrder, page: orders.totalPages, searchQuery, currentPage: orders.page});
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    
    getOrder: async(req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            
            order.createdAt = formatDate(order.createdAt);
            order.createdAt = formatDate(order.createdAt);
            
            // return res.status(200).json(order);
            // date now
            const dateNow = new Date();
            const dateNowFormat = formatDate(dateNow);
            
            return res.render('admin/order-detail', {order, dateNowFormat});
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    
    updateOrder: async(req, res) => {
        try {
            const order = await Order.findById(req.params.id);

            if(req.query.status) {
                order.status = req.query.status;
            }
            await order.save();
            return res.redirect('/admin/order/' + req.params.id);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    }

}

module.exports = OrderController;
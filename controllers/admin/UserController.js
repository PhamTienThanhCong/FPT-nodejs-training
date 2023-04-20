const User = require('../../models/User');
const Order = require('../../models/Order');

const UserController = {
    getAllUsers: async (req, res) => {
        const options = {
            page: req.query.page || 1,
            limit: 12,
        };
        const searchQuery = req.query.search || '';

        const query = {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ],
        };
        const users = await User.paginate(query, options);
        const userWithOrders = await Promise.all(
            users.docs.map(async (user) => {
                const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });
                const orderSummary = orders.reduce((acc, order) => {
                    acc.totalSales += 1;
                    acc.totalAmount += order.totalPrice;
                    acc.totalQuantity += order.products.reduce((sum, product) => sum + product.quantity, 0);
                    return acc;
                }, { totalSales: 0, totalAmount: 0, totalQuantity: 0 });
                return {
                    ...user._doc,
                    orderSummary,
                };
            }));
        return res.render('admin/users', { users: userWithOrders, searchQuery, totalPages: users.totalPages });
    },
}

module.exports = UserController;
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
            $and: [
                { $or: [
                    { username: { $regex: searchQuery, $options: 'i' } },
                ]},
                { admin: false }
            ]
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
            // return res.send(userWithOrders)
        return res.render('admin/users', { users: userWithOrders, searchQuery, totalPages: users.totalPages });
    },
    // view user by id
    viewUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            // return res.send(user);
            return res.render('admin/user-edit', { user });
        } catch (error) {
            
        }
    },
    // update user by id
    updateUser: async (req, res) => {
        try {
            const { username, email, phone, address } = req.body;
            await User.findByIdAndUpdate(req.params.id, { username, email, phone, address });
            return res.redirect(`/admin/customer/${req.params.id}/edit`);
        } catch (error) {
            
        }
    },
    // block user by id
    blockUser: async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.params.id, { block: true });
            return res.redirect(`/admin/customer/${req.params.id}/edit`);
        } catch (error) {
            
        }
    },
    // unblock user by id
    unblockUser: async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.params.id, { block: false });
            return res.redirect(`/admin/customer/${req.params.id}/edit`);
        } catch (error) {
            
        }
    }

}

module.exports = UserController;
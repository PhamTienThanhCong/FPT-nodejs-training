const Coupon = require("../../models/Coupon");

const formatDate = (date) => {
    let newDate = new Date(date);
    let formattedDate = newDate.toLocaleDateString();
    let formattedTime = newDate.toLocaleTimeString();
    return formattedDate + " " + formattedTime;
}

const CouponController = {
    getCoupons: async(req, res) => {
        // try {
            const options = {
                page: req.query.page || 1, 
                limit: 12, 
                sort: { createdAt: -1 }
            };
            const searchQuery = req.query.search || '';

            const query = {
                $or: [
                    { 'code': { $regex: searchQuery, $options: 'i' } },
                ],
            };
            // format data

            const coupons = await Coupon.paginate(query, options);
            const newCoupon = coupons.docs.map(coupon => {
                let statusView;
                if (coupon.Status.toLowerCase() === 'active') {
                    statusView = 'label-success';
                } else {
                    statusView = 'label-danger';
                }

                return {
                    id: coupon._id,
                    name: coupon.name,
                    code: coupon.CouponCode,
                    discount: coupon.Discount,
                    status: coupon.Status,
                    numberOfUsage: coupon.numberOfUsage,
                    numberOfUsageLeft: coupon.numberOfUsageLeft,
                    statusView: statusView,
                    createdAt: formatDate(coupon.createdAt),
                }
            });
            // return res.send(newCoupon);
            return res.send(newCoupon)
            return res.render('admin/coupon', {newCoupon, page: coupons.totalPages, searchQuery, currentPage: coupons.page, search: ""});
        // }
        // catch(err) {
        //     return res.status(500).json(err);
        // }
    },
    // render giao diện create
    createCouponView: async(req, res) => {
        return res.render('admin/coupon-create');
    },

    createCoupon: async(req, res) => {
        try {
            const { name, Validity, discount, numberOfUsage } = req.body;
            
            let code = name.toUpperCase();
            code = name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
            code = code.replace(/\s/g, '');
            code = code.replace(/[^a-zA-Z ]/g, "");
            // add ramdom number
            code = code + Math.floor(Math.random() * 1000);   
            const status = 'Active';

            const coupon = await Coupon.create({
                name,
                CouponCode: code,
                Discount: discount,
                Validity,
                Status: status,
                numberOfUsage,
                numberOfUsageLeft: numberOfUsage
            });
            return res.status(200).json(coupon);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    }

};

module.exports = CouponController;
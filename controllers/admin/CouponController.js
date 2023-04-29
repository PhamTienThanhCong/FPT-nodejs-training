const Coupon = require("../../models/Coupon");

const formatDate = (date) => {
    let newDate = new Date(date);
    let formattedDate = newDate.toLocaleDateString();
    let formattedTime = newDate.toLocaleTimeString();
    return formattedDate + " " + formattedTime;
}
function formatDateTime(data) {
    var couponValidity = new Date(data);
    var year = couponValidity.getFullYear();
    var month = (couponValidity.getMonth() + 1).toString().padStart(2, "0");
    var day = couponValidity.getDate().toString().padStart(2, "0");
    var hours = couponValidity.getHours().toString().padStart(2, "0");
    var minutes = couponValidity.getMinutes().toString().padStart(2, "0");
    var seconds = couponValidity.getSeconds().toString().padStart(2, "0");
    var formattedValidity = year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
    return formattedValidity;
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
                    { 'name': { $regex: searchQuery, $options: 'i' } },
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
                    Validity: formatDate(coupon.Validity),
                    expiryDate: formatDate(coupon.expiryDate),
                    createdAt: formatDate(coupon.createdAt),
                }
            });
            // return res.send(newCoupon);
            return res.render('admin/coupon', {newCoupon, page: coupons.totalPages, searchQuery, currentPage: coupons.page, search: ""});
        // }
        // catch(err) {
        //     return res.status(500).json(err);
        // }
    },
    createCouponView: async(req, res) => {
        return res.render('admin/coupon-create');
    },

    createCoupon: async(req, res) => {
        try {
            const { name, Validity, discount, numberOfUsage, expiryDate, Status } = req.body;
            
            let code = name.toUpperCase();
            code = name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
            code = code.replace(/\s/g, '');
            code = code.replace(/[^a-zA-Z ]/g, "");
            // add ramdom number
            code = code + Math.floor(Math.random() * 1000);   

            const coupon = await Coupon.create({
                name,
                CouponCode: code,
                Discount: discount,
                Validity,
                Status: Status,
                expiryDate,
                numberOfUsage,
                numberOfUsageLeft: numberOfUsage
            });
            return res.redirect('/admin/coupon');
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    editCouponView: async(req, res) => {
        try {
            const coupon = await Coupon.findById(req.params.id);
            var formattedValidity = formatDateTime(coupon.Validity);
            var formattedExpiryDate = formatDateTime(coupon.expiryDate);

            return res.render('admin/coupon-edit', {coupon, formattedValidity, formattedExpiryDate});
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    // update
    updateCoupon: async(req, res) => {
        try {
            const { name, Validity, discount, numberOfUsage, expiryDate, Status } = req.body;
            const coupon = await Coupon.findById(req.params.id);
            coupon.name = name;
            coupon.Validity = Validity;
            coupon.Discount = discount;
            coupon.numberOfUsageLeft = coupon.numberOfUsageLeft + (numberOfUsage - coupon.numberOfUsage);
            coupon.numberOfUsage = numberOfUsage;
            coupon.expiryDate = expiryDate;
            coupon.Status = Status;
            await coupon.save();
            return res.redirect(`/admin/coupon/edit/${req.params.id}`);
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
    // delete
    deleteCoupon: async(req, res) => {
        try {
            await Coupon.findByIdAndDelete(req.params.id);
            return res.redirect('/admin/coupon');
        }
        catch(err) {
            return res.status(500).json(err);
        }
    },
};

module.exports = CouponController;
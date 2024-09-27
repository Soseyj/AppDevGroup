const main = {
    index:(req, res) =>{
        res.render('index');
    },

    faqs:(req, res) =>{
        res.render('faqs');
    },

    ty:(req, res) =>{
        res.render('ty');
    },

    checkout:(req, res) =>{
        res.render('checkout');
    },

    cart:(req, res) =>{
        res.render('cart');
    },

    blog:(req, res) =>{
        res.render('blog');
    },

    about:(req, res) =>{
        res.render('about');
    },

    contact:(req, res) =>{
        res.render('contact');
    },

    services:(req, res) =>{
        res.render('services');
    },

    shop:(req, res) =>{
        res.render('shop');
    }
};
module.exports = main;
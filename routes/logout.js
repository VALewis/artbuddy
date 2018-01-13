// logout with signup form (render page and destroy session)
module.exports = (app) => {
    app.get('/logout', (req, res) => {
        if (req.session.user) {
            req.session.destroy()
            res.render('logout')
        } else {
        	console.log('something is wrong')
            // res.redirect('/')
        };
    });
};
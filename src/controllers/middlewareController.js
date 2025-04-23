const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const accessToken = authHeader.split(" ")[1];
            jwt.verify(accessToken, process.env.ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json('Token is not vaid');
                }
                req.user = user;
                next();
            })
        } else {
            res.status(401).json("you're not authenticated")
        }
    },
    verifyTokenAndAdimin: (res, req, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin) {
                next();
            }
            else {
                res.status(403).json("you're not allowed to delete orther");
            }
        })
    }
}

module.exports = middlewareController;
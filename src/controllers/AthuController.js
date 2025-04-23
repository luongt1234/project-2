const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const cookie = require('cookie-parser');
// const { Admin } = require("mongodb");
dotenv.config();

let refreshTokens = [];

const authController = {
    registerUser: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Kiểm tra đầu vào
            if (!username || !email || !password) {
                return res.status(400).json({ message: "Missing username, email, or password." });
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            //create User
            const newUser = await new User({
                username,
                email,
                password: hash,
            })
            const user = await newUser.save();

            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error during registration." });
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.ACCESS_KEY, { expiresIn: '30s' });
    },
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.REFRESH_TOKEN, {
            expiresIn: '365d'
        });
    },

    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if (!validPassword) {
                res.status(400).json("Wrong password!");
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    samSite: "strict"
                })
                const { password, ...other } = user.toObject();
                res.status(200).json({ ...other, accessToken});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error during registration." })
        }
    },
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("you're not auth ")
        }
        if (refreshTokens.includes(refreshToken)) {
            return res.status(403).json("refresh token is not vaild")
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
            if (err) {
                console.log(err);
            }
            // delete token from aray
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                path: "/",
                samSite: "strict"
            });
            res.status(200).json({accessToken: newAccessToken});
        })
    },
    userLogout: async(req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        res.status(200).json("logout")
    }
}

module.exports = authController;
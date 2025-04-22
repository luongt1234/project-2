const User = require("../models/user");
const bcrypt = require('bcrypt');

const authController  = {
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

    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});
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
                res.status(200).json(user);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Server error during registration."})
        }
    }
}

module.exports = authController;
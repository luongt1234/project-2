const User = require("../models/user");

const userController = {
    // get all user
    getAllUser: async (req, res) => {
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json("loi get all user");
        }
    },
    // delete
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json("User not found");
            }
            res.status(200).json("Delete successfully");
        } catch (error) {
            console.error(error);
            res.status(500).json("Error deleting user");
        }
    }
}

module.exports = userController;
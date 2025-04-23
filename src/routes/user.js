const router = require('express').Router()
const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController')

router.get('/getAllUser', middlewareController.verifyToken, userController.getAllUser);
router.delete('/deleteUser/:id', middlewareController.verifyTokenAndAdimin, userController.deleteUser);

module.exports = router;
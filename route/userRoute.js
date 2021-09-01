const router=require('express').Router();
const authController=require('../controller/authentication')
const userController=require('../controller/userController')
router.post('/signUp',authController.singUp)
router.post('/logIn',authController.logIn)
router.route('/allUser').get(userController.getUsers)
router.route('/:id').get(userController.getSingleUser)
module.exports=router
const router=require('express').Router();
const authController=require('../controller/authentication')
const userController=require('../controller/userController')

router.post('/signUp',authController.singUp)
router.post('/logIn',authController.logIn)
router.get('/logOut',authController.logOut)


// router.get('/singleUser/:id', userController.getSingleUser)

router.route('/allUsers').get( authController.protect, userController.getUsers)


module.exports=router
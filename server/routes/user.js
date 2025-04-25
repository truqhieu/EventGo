const router =require('express').Router()
const {verifyToken,isAdmin} = require('../middlewares/verify')
const ctrls = require('../controllers/user')

router.post('/register',ctrls.createUser)
router.post('/refreshtoken',ctrls.refreshToken)
router.post('/login',ctrls.login)
router.get('/getcurrent',[verifyToken],ctrls.getCurrent)
router.post('/regisevent',[verifyToken],ctrls.eventRegistration)
// router.put('/cancelevent',[verifyToken],ctrls.cancellEvent)
router.get('/finalregister/:token',ctrls.finalRegister)

module.exports =router
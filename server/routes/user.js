const router = require('express').Router()
const { verifyToken, isAdmin } = require('../middlewares/verify')
const ctrls = require('../controllers/user')

router.post('/register', ctrls.createUser)
router.post('/refreshtoken', ctrls.refreshToken)
router.post('/login', ctrls.login)
router.get('/getcurrent', [verifyToken], ctrls.getCurrent)
router.post('/regisevent', [verifyToken], ctrls.eventRegistration)
// router.put('/cancelevent',[verifyToken],ctrls.cancellEvent)
router.get('/finalregister/:token', ctrls.finalRegister)

router.get('/', ctrls.getAllUsers); // Lấy danh sách tất cả user
router.get('/:id', ctrls.getUserById); // Lấy thông tin user theo ID
router.put('/:id', ctrls.updateUser); // Cập nhật user
router.delete('/:id', ctrls.deleteUser); // Xóa user


router.post("/assign-event",  ctrls.assignEventToStaff);

module.exports = router
const express = require('express');
const router = express.Router();
const { Register, Login, GetUserById } = require('../controllers/userController');

router.post('/Register', Register);
router.post('/Login', Login);
router.get('/:id', GetUserById);

module.exports = router;
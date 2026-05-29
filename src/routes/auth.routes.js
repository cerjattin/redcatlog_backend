const express = require('express');

const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { registerSchema, loginSchema, refreshSchema } = require('../schemas/auth.schema');

const router = express.Router();
const passwordController = require('../controllers/password.controller');
const {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../schemas/password.schema');

router.patch(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  passwordController.changeMyPassword
);

router.post('/forgot-password', validate(forgotPasswordSchema), passwordController.forgotPassword);

router.post('/reset-password', validate(resetPasswordSchema), passwordController.resetPassword);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);
router.put('/password/change', validate(changePasswordSchema), passwordController.changeMyPassword);
router.post('/password/forgot', validate(forgotPasswordSchema), passwordController.forgotPassword);
router.post('/password/reset', validate(resetPasswordSchema), passwordController.resetPassword);

module.exports = router;

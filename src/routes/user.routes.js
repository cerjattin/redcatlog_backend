const express = require('express');

const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  updateMeSchema,
  listUsersSchema,
  userIdParamSchema,
  updateUserStatusSchema,
} = require('../schemas/user.schema');
const passwordController = require('../controllers/password.controller');
const { adminUpdateUserPasswordSchema } = require('../schemas/password.schema');

const router = express.Router();

router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, validate(updateMeSchema), userController.updateMe);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(listUsersSchema),
  userController.listUsers
);

router.patch(
  '/:id/password',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(adminUpdateUserPasswordSchema),
  passwordController.adminUpdateUserPassword
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(userIdParamSchema),
  userController.getUserById
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(updateUserStatusSchema),
  userController.updateUserStatus
);

module.exports = router;

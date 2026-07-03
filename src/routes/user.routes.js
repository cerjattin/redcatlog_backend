const express = require('express');

const userController = require('../controllers/user.controller');
const passwordController = require('../controllers/password.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');

const {
  createUserSchema,
  updateMeSchema,
  listUsersSchema,
  userIdParamSchema,
  updateUserStatusSchema,
} = require('../schemas/user.schema');

const { adminUpdateUserPasswordSchema } = require('../schemas/password.schema');

const router = express.Router();

router.get('/me', authMiddleware, userController.getMe);

router.put(
  '/me',
  authMiddleware,
  validate(updateMeSchema),
  userController.updateMe
);

router.get(
  '/',
  authMiddleware,
  adminOnly,
  validate(listUsersSchema),
  userController.listUsers
);

router.post(
  '/',
  authMiddleware,
  adminOnly,
  validate(createUserSchema),
  userController.createUser
);

router.patch(
  '/:id/password',
  authMiddleware,
  adminOnly,
  validate(adminUpdateUserPasswordSchema),
  passwordController.adminUpdateUserPassword
);

router.get(
  '/:id',
  authMiddleware,
  adminOnly,
  validate(userIdParamSchema),
  userController.getUserById
);

router.patch(
  '/:id/status',
  authMiddleware,
  adminOnly,
  validate(updateUserStatusSchema),
  userController.updateUserStatus
);

module.exports = router;
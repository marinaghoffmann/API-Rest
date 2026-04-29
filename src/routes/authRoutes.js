const { Router } = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres.'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
    body('password').notEmpty().withMessage('Senha é obrigatória.'),
  ],
  login
);

module.exports = router;
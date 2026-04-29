const { Router } = require('express');
const { body } = require('express-validator');
const {
  create,
  findAll,
  findOne,
  update,
  remove,
  getStats,
} = require('../controllers/speciesController');
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.use(authMiddleware);

router.get('/stats', getStats);

router.get('/', findAll);

router.get('/:id', findOne);

router.post(
  '/',
  [
    body('commonName').trim().notEmpty().withMessage('Nome comum é obrigatório.'),
    body('scientificName').trim().notEmpty().withMessage('Nome científico é obrigatório.'),
    body('category').trim().notEmpty().withMessage('Categoria é obrigatória.'),
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude deve ser entre -90 e 90.'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude deve ser entre -180 e 180.'),
  ],
  create
);

router.put(
  '/:id',
  [
    body('commonName').optional().trim().notEmpty().withMessage('Nome comum não pode ser vazio.'),
    body('scientificName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Nome científico não pode ser vazio.'),
    body('category').optional().trim().notEmpty().withMessage('Categoria não pode ser vazia.'),
    body('latitude')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude deve ser entre -90 e 90.'),
    body('longitude')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude deve ser entre -180 e 180.'),
  ],
  update
);

router.delete('/:id', remove);

module.exports = router;
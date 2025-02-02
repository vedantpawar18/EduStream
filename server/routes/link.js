const express = require('express');
const router = express.Router();

// validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators');

// controllers
const { requireSignin, authMiddleware } = require('../controllers/auth');
const { create, list, read, update, remove } = require('../controllers/link');

// routes
router.post('/link', linkCreateValidator, runValidation, requireSignin, authMiddleware, create);
router.get('/links', list);
router.get('/link/:slug', read);
router.put('/link/:slug', linkUpdateValidator, runValidation, requireSignin, authMiddleware, create);
router.delete('/link/:slug', requireSignin, authMiddleware, remove);

module.exports = router;

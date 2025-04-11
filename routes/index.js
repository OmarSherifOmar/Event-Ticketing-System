const express = require('express');
const router = express.Router();

const exampleRoutes = require('./exampleRoutes');

router.use('/examples', exampleRoutes);

module.exports = router;
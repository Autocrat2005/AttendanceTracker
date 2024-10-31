const express = require('express');
const router = express.Router();

// Example endpoint for testing
router.get('/', (req, res) => {
    res.send('Auth route is working');
});

module.exports = router;

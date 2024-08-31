const express = require("express");

const User = require('../models/user');

const router =express.Router();
router.get('/resumes',async(req,res)=>{
    try {
        const users = await User.find({ role: 'NORMAL' }).select('name email resume');
        res.json(users);
    } catch (error) {
        res.status(500).send('Server error');
    }
})


module.exports = router;
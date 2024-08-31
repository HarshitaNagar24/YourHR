const express = require("express");
const path = require('path');
const multer = require('multer');
const {handleUserSignup, handleUserLogin, handleUploadResume, handleCurrentUser, handleCurrentResume} =require("../controllers/user");
 
const router =express.Router();


// Configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname); // Use path to get file extension
    }
  });
const upload = multer({ storage: storage });

router.post("/signup",handleUserSignup);
router.post("/login",handleUserLogin);
router.post('/upload', upload.single('resume'), handleUploadResume);
router.get('/current-user',handleCurrentUser);
router.get('/current-resume',handleCurrentResume);

module.exports = router;
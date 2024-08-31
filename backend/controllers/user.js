const User = require("../models/user");
const { setUser } = require('../service/auth');
// Hash the password (this example assumes you have bcrypt installed)
const bcrypt = require('bcryptjs');



async function handleUserSignup(req,res){

    try {
        const {name, email, password} = req.body;
        // check user is available with given email
        if(existingUser =  await User.findOne({email})) return  res.status(400).json({message: "Email already exists"});
    
        // Hash the password with bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);
        // create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        return res.status(201).json({msg:"User Created",  userName: req.body.name});

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send({ message: "Server error" });
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        
        // If no user is found, return an error
        if (!user) {
            return res.status(404).json({ message: "Invalid username or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isValidPassword = await bcrypt.compare(password, user.password);

        // If the password is incorrect, return an error
        if (!isValidPassword) {
            return res.status(404).json({ message: "Invalid username or password" });
        }

        // Assuming setUser is a function that generates a token for the user
        const token = setUser(user);
        res.cookie("token", token);
        
        return res.json({ user, token , message:"Login Successfully"});

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("Server error");
    }
}

// uplode Resume
async function handleUploadResume(req,res) {
  try {
    // Find the user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's resume field with the uploaded file details
    user.resume =  req.file.path;
    // Save the updated user
    await user.save();

    // Respond with the URL of the uploaded resume
    const resumeUrl = `http://localhost:8000/${user.resume}`;
    res.json({ message: 'Resume uploaded successfully', resumeUrl });
    // Ensure only one response is sent
    if (!res.headersSent) {
        res.json({
                message: 'Resume uploaded and user updated successfully',
                user,
          });
        }
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resume', error });
  }
    
}

async function handleCurrentUser(req,res) {
  try {
     // Find the user by ID from the authenticated request
     const user = await User.findById(req.user._id).select('-password'); // Exclude password field
    
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
    const resumeUrl = user.resume ? `http://localhost:8000/${user.resume}` : '';
    res.json({ resumeUrl, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

async function handleCurrentResume(req,res){
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.resume) {
        return res.status(404).json({ message: 'No resume found' });
    }
    const resumeUrl = user.resume ? `http://localhost:8000/${user.resume}` : '';
    res.json({ resumeUrl });
} catch (error) {
    res.status(500).send('Server error');
}

}


module.exports={
    handleUserSignup,
    handleUserLogin,
    handleUploadResume,
    handleCurrentUser,
    handleCurrentResume,
}
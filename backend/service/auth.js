const jwt = require("jsonwebtoken");
const secret = "Harshita$24@$";

function setUser(user){
    return jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role,
    },secret);
}

function getUser(token){
    if(!token) return null;

    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("JWT verification Failed : ", error.message);
        return null;
    }
}

module.exports={
    setUser,
    getUser,
};
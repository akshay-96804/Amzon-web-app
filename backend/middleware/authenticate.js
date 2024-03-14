import jwt from "jsonwebtoken";
import User from "../models/userSchema.js" ; 

// const {jwt} = pkg ;

// import User from "../models/userSchema";

const keysecret = "abcdefghijklmnopqrstuvwxyzzyxtuv" ;

const authenticate = async(req,res,next)=>{
    try {
        const token = req.cookies.Amazonweb;
        
        const verifyToken = jwt.verify(token,keysecret);
     
        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
       

        if(!rootUser){ throw new Error("User Not Found") };

        req.token = token; 
        req.rootUser = rootUser;   
        req.userID = rootUser._id;   
    
        next();  

    } catch (error) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(error);
    }
};

export default authenticate ;
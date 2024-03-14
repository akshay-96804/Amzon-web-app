import mongoose from "mongoose";
import validator from "validator" ;
import bcrypt from "bcryptjs" ;
import jwt from "jsonwebtoken" ;

const keysecret = "abcdefghijklmnopqrstuvwxyzzyxtuv" ;

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email address");
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    carts:Array
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({ _id:this._id},keysecret);
        this.tokens = this.tokens.concat({token:token});

        await this.save();
        return token;

    } catch (error) {
        console.log(error);
    }
}

userSchema.methods.addcartdata = async function(cart){
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts;
    } catch (error) {
        console.log(error + "bhai cart add time aai error");
    }
}

const User = new mongoose.model("USER", userSchema);

export default User; 

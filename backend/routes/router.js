import express from "express" ;
import Products from "../models/productSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs" ;
import authenticate from "../middleware/authenticate.js";

// import Products from "../models/productSchema";

const router = express.Router();

router.get("/getproducts",async (req,res)=>{
    try {
        const productsData = await Products.find({});
        console.log(productsData);

        res.status(201).json(productsData);

    } catch (error) {
        console.log("error"+error.message);  
    }
})


router.get("/getproductsone/:id", async (req, res) => {

    try {
        const { id } = req.params;
        // console.log(id);

        const individual = await Products.findOne({ id: id });
        console.log(individual + "ind mila hai");

        res.status(201).json(individual);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/register",async (req,res)=>{
    const { fname, email, mobile, password} = req.body;

    if (!fname || !email || !mobile || !password) {
        res.status(422).json({ error: "filll the all details" });
    };

    try {
        const preuser = await User.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This email is already exist" });
        } else {

            const finaluser = new User({
                fname, email, mobile, password
            });

            const storedata = await finaluser.save();
            res.status(201).json(storedata);
        }


    } catch (error) {
        
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    }

    try {
        const userlogin = await User.findOne({ email: email });
        // console.log(userlogin);

        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            const token = await userlogin.generateAuthToken();

            res.cookie("Amazonweb", token, {
                expires: new Date(Date.now() + 2589000),
                httpOnly: false
            });


            if (!isMatch) {
                res.status(400).json({ error: "invalid crediential pass" });
            }
            else{
                res.status(201).json(userlogin);
            }
        }
        else{
            res.status(400).json({error:"Invalid details"});
        }


    } catch (error) {
        
    }
})


// adding data into cart
router.post("/addcart/:id",authenticate,async(req,res)=>{
    try {
        const {id} = req.params ;
        const cart = await Products.findOne({id:id});

        const Usercontact = await User.findOne({ _id: req.userID });

        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);

            await Usercontact.save();
            
            console.log(cartData + " thse save wait kr");
            console.log(Usercontact + "userjode save");
            res.status(201).json(Usercontact);
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/cartdetails',authenticate,async(req,res)=>{
    try {
        const buyuser = await User.findOne({ _id: req.userID });
        console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
    }

})

router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validuserone = await User.findOne({ _id: req.userID });
        console.log(validuserone + "user hain home k header main pr");
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});

router.get("/remove/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((cur) => {
            return cur.id != id
        });

        console.log(req.rootUser.carts.length);

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item remove");

    } catch (error) {
        console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("Amazonweb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
})

export default router ;
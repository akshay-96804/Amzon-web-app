import Products from "./models/productSchema.js";
// import Products from "./models/productSchema.js" ;
import productsData from "./constants/productsData.js";

const DefaultData = async()=> {
    try {
        await Products.deleteMany();
        const storeData = await Products.insertMany(productsData);
        console.log(storeData);
    } catch (error) {

    }
}

export default DefaultData ;

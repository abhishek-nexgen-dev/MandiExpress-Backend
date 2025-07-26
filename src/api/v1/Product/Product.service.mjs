class Product_Service {
    createProduct({data , ProductImage}){
        try{

        }catch(error){
            console.error("Error creating product:", error);
            throw new Error("Product creation failed.");
        }
    }
}
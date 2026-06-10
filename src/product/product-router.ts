import { Router } from "express";
import { addProduct } from "./product-controllers/add-product";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { productValidator } from "./product-validato";
import { updateProduct } from "./product-controllers/update-product";
import { getProductById } from "./product-controllers/get-product-by-id";
import { getAllProducts } from "./product-controllers/get-all-product";
import { deleteProduct } from "./product-controllers/delete-product";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { isAuthorized } from "../middlewares/isAuthorized.middleware";
import { Role } from "../user/user-model";


const router= Router();

router.get('/',isAuthenticated,getAllProducts)
router.get('/:id',isAuthenticated,getProductById)
router.post('/add',isAuthenticated,isAuthorized(Role.Admin),productValidator,handleValidationErrors,addProduct)
router.put('/:id',isAuthenticated,isAuthorized(Role.Admin),productValidator,handleValidationErrors,updateProduct)
router.delete('/:id',isAuthenticated,isAuthorized(Role.Admin),deleteProduct)




export default router
import { Router } from "express";
import { getAllUsers } from "./user-controllers/get-all-users";
import { createUserValidator, updateUserNameValidation } from "./user-validator";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { addUser } from "./user-controllers/add-user";
import { getUserById } from "./user-controllers/get-user-by-id";
import { deleteUserById } from "./user-controllers/delete-user-by-id";
import { updateUserNameById } from "./user-controllers/update-user-name-by-id";
import { upload } from "../middlewares/upload.middleware";
import { parseAddressBox } from "../middlewares/parse-address-box";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { completeUserInfo, completeUserInfoValidator } from "./user-controllers/complete-user-info";
import { isAuthorized } from "../middlewares/isAuthorized.middleware";
import { Role } from "./user-model";

const router = Router();

router.get('/',getAllUsers);
router.get('/:id',
    isAuthenticated,
    isAuthorized(Role.Admin),
    getUserById);

router.post('/add',
    upload.single('profileImage'),
    parseAddressBox,
    createUserValidator,
    handleValidationErrors,
    addUser
);
router.post('/address',
    isAuthenticated,
    completeUserInfoValidator,
    handleValidationErrors,
    completeUserInfo
);

router.put('/:id',
    updateUserNameValidation,
    handleValidationErrors,
    updateUserNameById
);
router.delete('/:id',deleteUserById);

export default router;
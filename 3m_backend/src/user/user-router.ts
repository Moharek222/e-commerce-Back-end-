import { Router } from "express";
import { getAllUsers } from "./user-controllers/get-all-users";
import { createUserValidator } from "./user-validator";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { addUser } from "./user-controllers/add-user";
import { getUserById } from "./user-controllers/get-user-by-id";
import { deleteUserById } from "./user-controllers/delete-user-by-id";
import { upload } from "../middlewares/upload.middleware";
import { parseAddressBox } from "../middlewares/parse-address-box";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { completeUserInfo, completeUserInfoValidator } from "./user-controllers/complete-user-info";
import { isAuthorized } from "../middlewares/isAuthorized.middleware";
import { Role } from "./user-model";
import { updateUser, updateUserValidator } from "./user-controllers/update-user";

const router = Router();

router.get('/',
    isAuthenticated,
    isAuthorized(Role.Admin),
    getAllUsers);

router.get('/:id',
    isAuthenticated,
    isAuthorized(Role.Admin),
    getUserById);

router.post('/add',
    isAuthenticated,
    isAuthorized(Role.Admin),
    upload.single('profileImage'),
    parseAddressBox,
    createUserValidator,
    handleValidationErrors,
    addUser
);
router.post('/complete-info',
    isAuthenticated,
    completeUserInfoValidator,
    handleValidationErrors,
    completeUserInfo
);

router.put('/update',
    isAuthenticated,
    updateUserValidator,
    handleValidationErrors,
    updateUser
);
router.delete('/:id',
    isAuthenticated,
    isAuthorized(Role.Admin),
    deleteUserById);

export default router;
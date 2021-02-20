import { checkRole } from '../middlewares/role';
import { checkJwt } from "../middlewares/jwt";
import { UserController } from "../controller/UserController";
import { Router } from "express";


const router = Router();

//Get all users
router.get('/', UserController.getAll);

//Get one users
router.get('/:id', [checkJwt], UserController.getById);

//Create new users
router.post('/', [checkJwt, checkRole(['admin'])], UserController.newUser);

//Update users
router.put('/:id', [checkJwt], UserController.editUser);

//Delete users
router.delete('/:id', [checkJwt], UserController.deleteUser);

export default router;
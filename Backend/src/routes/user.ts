import { Router } from "express";
import controller from "../controller";
// import controller from "../controllers";
// import {authenticateUser, validateRequest} from '../middleware';
// import validators from "../validators";

const router = Router();


router.get("/userData",controller.Users.userdetails)
router.put("/update-points",controller.Users.updatePoints)
router.get('/getTransactionInfo',controller.Users.getTransaction)
router.post('/getTransactionMessages',controller.Users.getTransactionMsg)
router.post('/getNeox',controller.Users.getNeox)
router.post('/fillWallet',controller.Users.fillWallet)
router.post('/queryWallet',controller.Users.queryWallet)


export default router;



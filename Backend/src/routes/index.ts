import express from 'express';
import userRoutes from './user'
const router = express.Router();


const defaultRoutes = [
  {
    path: '/',
    route: userRoutes,
  },
];

router.get("/",async(req,res):Promise<any>=>{
    return res.status(200).send({ status:true, message: "Api is running" });
});

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});



export default router;
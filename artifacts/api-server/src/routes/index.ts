import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import conversationsRouter from "./conversations";
import contactsRouter from "./contacts";
import campaignsRouter from "./campaigns";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/conversations", conversationsRouter);
router.use("/contacts", contactsRouter);
router.use("/campaigns", campaignsRouter);
router.use("/users", usersRouter);

export default router;

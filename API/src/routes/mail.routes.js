import { Router } from "express";
import { querySupport } from "../controller/querySupport.controller.js";

const router = Router();

router
.route("/sendQuery")
.post(querySupport)

export default router
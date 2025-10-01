import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";
import errorHandler from './middleware/errorHandler.middleware.js'
import requestLogger from "./middleware/requestLogger.middleware.js";
import { ApiError } from './utils/ApiError.js';


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
}))

if (process.env.NODE_ENV === "dev") {
    const swaggerDocument = yaml.load("./docs/swagger.yaml");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(requestLogger);


// app.use(session({
//     secret: process.env.SESSION_SECRET || "notify_secret",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter)

import projectRouter from './routes/project.routes.js'
app.use("/api/v1/project", projectRouter)

import environmentRouter from './routes/environment.routes.js'
app.use("/api/v1/environment", environmentRouter)

import patRouter from './routes/pat.routes.js'
app.use("/api/v1/pat", patRouter)

import callCoreRouter from './routes/callCore.routes.js'
app.use("/api/v1/callCore", callCoreRouter)

import mailRouter from './routes/mail.routes.js'
app.use("/api/v1/mail", mailRouter)


// app.use((req, res, next) => {
//     next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
// });


app.use(errorHandler);

export { app }
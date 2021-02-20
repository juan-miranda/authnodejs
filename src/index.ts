import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { Request, Response } from "express";
import * as cors from 'cors';
import * as helmnet from 'helmet';
import routes from "./routes/";


const PORT = process.env.PORT || 3000

createConnection().then(async () => {

    // create express app
    const app = express();
    //Middlewares
    app.use(cors());
    app.use(helmnet());

    app.use(express.json());
    app.use('/', routes);

    // start express server
    app.listen(PORT, () => console.log(`corriendo en el puerto ${PORT}`));

}).catch(error => console.log(error));

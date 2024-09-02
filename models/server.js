import express, { json } from 'express';
import dbConnect from '../database/config.js';
import '../database/config.js';
import parkingLotRouter from '../routes/parkingLotRoute.js';
import { putParking } from '../controller/parkingLotController.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.pathParkingLot = '/api/parking';

        this.middlewares();
        this.dbConnection();
        this.routes();
    };

    async dbConnection() {
        await dbConnect();
    };

    middlewares() {
        this.app.use(json());
    };

    routes() {
        this.app.use(this.pathParkingLot, parkingLotRouter);
        this.app.use(this.pathParkingLot+'/:id', putParking);
        // this.app.use(this.pathParkingLot+'/disponible', getParkingAvailableCells);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        });
    }
}

export default Server
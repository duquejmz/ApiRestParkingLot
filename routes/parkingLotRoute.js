import { Router } from 'express'
import { deleteParking, getCalculateFee, getParking, getParkingAvailableCells, getParkingById, postExitVehicle, postParking, postParkVehicle, putParking } from '../controller/parkingLotController.js'

const parkingLotRouter = Router()

parkingLotRouter.get('/', getParking);
parkingLotRouter.get('/:id', getParkingById);
parkingLotRouter.get('/parkingAvailableCells', getParkingAvailableCells);
parkingLotRouter.post('/', postParking);
parkingLotRouter.put('/:id', putParking);
parkingLotRouter.delete('/:id', deleteParking);
parkingLotRouter.post('/parkVehicle', postParkVehicle);
parkingLotRouter.get('/calculateFee/:id', getCalculateFee);
parkingLotRouter.post('/exitVehicle/:id', postExitVehicle);

export default parkingLotRouter

import parkingLot from "../models/parkingLot.js";
import bcrypt from 'bcryptjs';

// Conformado por la encriptaciónm, de la concatenación de : "cellNumber" + "vehiclePlate".

const generationPin = (cellNumber, vehiclePlate) => {
    return bcrypt.hashSync(`${cellNumber}${vehiclePlate}`, 4);
};

// Get para traer todos los valores

export async function getParking (req, res) {
    const cells = await parkingLot.find();
    res.status(200).json(cells);
};

// Post para crear una nueva celda

export async function postParking (req, res) {
    const maxParkingLot = 10;
    try {
        const count = await parkingLot.countDocuments();
        if (count >= maxParkingLot) {
            return res.status(400).json({ message: 'Maximum cell limit has been reached' })
        };

        const lastCell = await parkingLot.findOne().sort('-cellNumber');
        const cellNumber = lastCell ? lastCell.cellNumber + 1 : 1;

        const newParking = new parkingLot({
            cellNumber,
            status: req.body.status || 'disponible',
            vehiclePlate: req.body.vehiclePlate || undefined,
            entryDate: req.body.entryDate ? new Date : undefined,
            exitDate: req.body.exitDate ? new Date : undefined,
            pin: req.body.vehiclePlate ? generationPin(cellNumber, req.body.vehiclePlate) : undefined
        });
        await newParking.save();
        res.status(201).json(newParking);
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
}

// Put para actualizar buscando por el id

export async function putParking (req, res) {
    try {
        const cell = await parkingLot.findById(req.params.id);
        if (!cell) return res.status(404).json({ msg: 'Cell not found' });

        if (req.body.status) cell.status = req.body.status;
        if (req.body.vehiclePlate) {
            cell.vehiclePlate = req.body.vehiclePlate;
            cell.entryDate = new Date();
            cell.pin = generationPin(cell.cellNumber, req.body.vehiclePlate);
        }
        if (req.body.exitDate) cell.exitDate = new Date();
        await cell.save();
        res.status(200).json(cell)
    } catch (error) {
        res.status(400).json({ msg : error.msg });
    }
}

// Get para traer una celda por el id

export async function getParkingById (req, res) {
    try {
        const cell = await parkingLot.findById(req.params.id);
        if (!cell) return res.status(404).json({ error : 'cellNumber not found' });
        res.status(200).json(cell);
    } catch (error) {
        res.status(400).json({ error : error.message });
    }

}

// Get para traer todas las celdas que esten en estado diponible

export async function getParkingAvailableCells (req, res) {
    try {
        console.log("Querying for available cells with status 'disponible'");
        const cells = await parkingLot.find({ status : 'disponible' });
        res.status(200).json(cells);
    } catch (error) {
        console.log("Error encountered:", error);
        res.status(400).json({ error : error.message });
    }
} // AUN NO ME FUNCIONA - NO QUIERE :( 

// Delete para como lo dice el nombre del metodo, eliminar una celda. +-+

export async function deleteParking (req, res) {
    try {
        const cell = await parkingLot.findByIdAndDelete(req.params.id);
        if (!cell) return res.status(404).json({ error : 'Parkimg Lot not Found' });
        res.status(200).json(cell);
    } catch (error) {
        res.status(400).json({ error : error.message });
    }
}

// Post para parquear el vehiculo

export async function postParkVehicle (req, res) {
    try {
        const cell = await parkingLot.findOneAndUpdate(
            { status : 'disponible' },
            { status : 'no disponible', vehiclePlate: req.body.vehiclePlate, entryDate: new Date() },
            { new : true }
        );
        if (!cell) return res.status(404).json({ error : 'No available Cell' });
        res.status(200).json(cell);
    } catch (error) {
        res.status(400).json({ error : error.message });
    }
}

// Get paea calcular el valor a pagar

export async function getCalculateFee (req, res) {
    try {
        const cell = await parkingLot.findById(req.params.id);
        if (!cell || !cell.exitDate || !cell.entryDate) return res.status(404).json({ error : 'Incomplete parking date' });

        const hours = Math.floor((cell.exitDate - cell.entryDate) / (1000 * 60 * 60));
        const fee = hours * 5000;
        res.status(200).json({ fee })
    } catch (error) {
        res.status(400).json({ error : error.message });
    }
}

// Post para registrar la salida

export async function postExitVehicle (req, res) {
    try {
        const cell = await parkingLot.findByIdAndUpdate(
            req.params.id,
            { status : 'disponible', vehiclePlate : '', entryDate : null, exitDate : new Date(), pin : '' },
            { new : true }
        );
        if (!cell) return res.status(404).json({ error : "Cell not found"});
        res.status(200).json(cell);
    } catch (error) {
        res.status(400).json({ error : error.message })
    }
}
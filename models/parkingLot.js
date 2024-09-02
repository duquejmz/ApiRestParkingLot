import { model, Schema } from 'mongoose'

const parkingLotSchema = new Schema({
    cellNumber: {
        type: Number,
        unique: true,
        required: [true, 'the number cell is required'],
        default: 0
    },
    status: {
        type: String, 
        enum: [ 'disponible', 'no disponible' ], 
        default: 'disponible',
        // required: [true, 'the status is required']
    },
    vehiclePlate: {
        type: String,
        maxlength: [6, 'Max 6 characters'],
    },
    entryDate: {
        type: Date,
    },
    exitDate: {
        type: Date,
    },
    pin: {
        type: String
        // Se conforma con la encriptación de la concatenacion del cellNumber y con vehiclePlate.
    }
},
{
    versionKey: false,
    timestamps: true
})

export default model('parkingLot', parkingLotSchema, 'parkingLot')

'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FacturasSchema = Schema({
    serie: Number,
    numero: Number,
    fecha: Date,
    productos:[{
        cantidad: Number,
        subtotal: Number,
        producto:{type: Schema.ObjectId, ref:'productos'}
    }],
    tarjeta:String,
    total: Number,
    usuario:{type: Schema.ObjectId, ref:'user'}
})

module.exports = mongoose.model('factura',FacturasSchema)
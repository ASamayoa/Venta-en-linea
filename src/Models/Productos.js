'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProductosSchema = Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    cantidad: Number,
    vendido: Number,
    Categoria:{type: Schema.ObjectId, ref:'categoria'}
})

module.exports = mongoose.model('productos', ProductosSchema)
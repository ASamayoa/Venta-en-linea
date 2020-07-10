'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UsuarioSchema = Schema({
    user: String,
    nombre: String,
    apellido: String,
    email: String,
    rol: String,
    password: String,
    tarjetas:[{
        nombrePropietario: String,
        numero: String,
        numeroSeguridad: String
    }],
    carrito:[{
        cantidad: Number,
        subtotal: Number,
        producto:{type: Schema.ObjectId, ref:'productos'}
    }],
    totalCarrito: Number
})

module.exports = mongoose.model('user', UsuarioSchema)
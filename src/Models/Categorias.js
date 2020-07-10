'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CategoriasSchema = Schema({
    nombre: String,
    descripcion: String
})

module.exports = mongoose.model('categoria', CategoriasSchema)
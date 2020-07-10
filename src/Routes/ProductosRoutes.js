'use strict'

var ProduC = require('../Controller/ProductosController')
var express = require('express')
var md_auth = require('../middlewares/authnticated')


var api = express.Router()
api.post('/ingresarProduct',md_auth.ensureAuth, ProduC.ingresarProducto)
api.put('/ediProduct/:id',md_auth.ensureAuth, ProduC.editarProducto)
api.put('/ediStock/:id',md_auth.ensureAuth, ProduC.editarStock)
api.delete('/eliProduct/:id',md_auth.ensureAuth, ProduC.eliminarProducto)

module.exports = api
'use strict'

var express = require('express')
var FacturaC = require('../Controller/FacturaController')
var md_auth = require('../middlewares/authnticated')

var api = express()
api.post('/IFactura/:id',md_auth.ensureAuth,FacturaC.ingresarFactura)
api.post('/GFactura/:id',md_auth.ensureAuth,FacturaC.generarPDF)
api.get('/getFacturas',md_auth.ensureAuth,FacturaC.verfacturas)
api.get('/getFactura/:id',md_auth.ensureAuth,FacturaC.verfactura)
api.get('/getMV',FacturaC.verVendidas)
api.get('/getAgo',FacturaC.verAgotados)
api.get('/getPCat/:categ',FacturaC.verPorCategoria)
api.get('/getPNom',FacturaC.produPorNombre)
module.exports = api
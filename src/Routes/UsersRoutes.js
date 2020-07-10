'use strict'

var UserC = require('../Controller/UsersController')
var express = require('express')
var md_auth = require('../middlewares/authnticated')

var api = express.Router()
api.post('/ingresarUser', UserC.ingresarCliente)
api.post('/ingresarAdmin',UserC.ingresarAdmin)
api.post('/login', UserC.login)
api.put('/ediUser/:id',md_auth.ensureAuth,UserC.editarPerfil)
api.delete('/eliUser/:id',md_auth.ensureAuth,UserC.eliminarPerfil)
api.put('/ICarrito/:id', md_auth.ensureAuth, UserC.agregarCarrito)
api.put('/eliCarrito/:id', md_auth.ensureAuth, UserC.eliminarCarrito)
api.put('/ediCarrito/:id', md_auth.ensureAuth, UserC.editarCarrito)
api.put('/ITarjeta/:id', md_auth.ensureAuth, UserC.agregarTarjeta)
api.put('/eliTarjeta/:id', md_auth.ensureAuth, UserC.eliminarTarjeta)
api.get('/getUser',md_auth.ensureAuth,UserC.verUser)
api.get('/getCarrito',md_auth.ensureAuth,UserC.verCarrito)
api.get('/getTarjeta',md_auth.ensureAuth,UserC.verTarjeta)


module.exports = api
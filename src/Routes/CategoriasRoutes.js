'use strict'

var CateC = require('../Controller/CategoriasController')
var express = require('express')
var md_auth = require('../middlewares/authnticated')


var api = express.Router()
api.post('/ingresarCateg',md_auth.ensureAuth, CateC.ingresarCategorias)
api.put('/ediCateg/:id',md_auth.ensureAuth, CateC.editarCategorias)
api.delete('/eliCateg/:id',md_auth.ensureAuth, CateC.eliminarCategorias)
api.get('/getCategorias',CateC.listar)

module.exports = api
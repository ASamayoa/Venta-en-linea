'use strict'

var express = require("express")
var app = express()
var bodyparser = require("body-parser")
var userRoutes = require('./Routes/UsersRoutes') 
var producRoutes = require('./Routes/ProductosRoutes')
var categRoutes = require('./Routes/CategoriasRoutes')
var facturasRoutes = require('./Routes/FacturasRoutes')

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next();
})

app.use('/api', userRoutes, producRoutes, categRoutes, facturasRoutes)

module.exports = app
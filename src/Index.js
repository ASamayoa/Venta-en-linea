'use strict'

var mongoose = require('mongoose')
var app = require('./app')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/DBProyecto2018374',{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log('Se conecto a la base de datos');

    app.set('port', process.env.PORT || 3000)
    app.listen(app.get('port'), ()=>{
        console.log(`El clauster esta en el pruerto ${app.get('port')}`)
    })
}).catch(err =>console.log(err))
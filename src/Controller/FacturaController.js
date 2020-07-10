'use strict'

var Factura = require('../Models/Facturas')
var User = require('../Models/Usuario')
var Produ = require('../Models/Productos') 
var PDFKit = require('pdfkit')
var files = require('fs')

function ingresarFactura(req,res){
    var factura = new Factura

    Factura.find({},(err,facturas)=>{
        if(err) return res.status(500).send({message: 'Error al buscar Facturas'})
        console.log(facturas.length);
        if(facturas.length<1){
            factura.serie=0
            factura.numero=0
        }else{
            if(facturas[facturas.length-1].numero<99999){
                factura.serie = facturas[facturas.length-1].serie
                factura.numero = facturas[facturas.length-1].numero+1
            }else{
                factura.serie = facturas[facturas.length-1].serie + 1
                factura.numero = 0
            }
        }
        
        var D = new Date
        var dia = D.getDate()
        var mes = D.getMonth()+1
        var year = D.getFullYear()
        factura.fecha =(year+'-'+mes+'-'+dia)
        console.log(factura.fecha);
        
        
        User.findById(req.params.id).populate('carrito.producto').exec((err,usuario)=>{
            if(err) return res.status(500).send({message: 'Error al buscar Usuarios'})
            if(!usuario) return res.status(404).send({message:'No se ha encontrado el usuario'})
            var cont  = 0
            var acum
            do{
                acum = usuario.carrito[cont].cantidad
                if(acum<=usuario.carrito[cont].producto.cantidad){
                    Produ.findByIdAndUpdate(usuario.carrito[cont].producto,
                        {$inc:{cantidad:-usuario.carrito[cont].cantidad,vendido:1}},
                        (err,producto)=>{
                        if(err) return res.status(500).send({message: 'Error al buscar Usuarios'})
                        if(!producto) return res.status(404).send({message:'No se ha encontrado el Producto'})
                        })
                }else{
                    res.status(500).send({message: 'Error. No hay suficiente cantidad de: '+usuario.carrito[cont].producto.nombre})
                }
                cont ++
            }while(cont<usuario.carrito.length)

            factura.productos = usuario.carrito
            factura.total = usuario.totalCarrito
            factura.usuario = usuario.id
            factura.tarjeta = usuario.tarjetas[req.body.numero-1].numero

            User.findByIdAndUpdate(req.params.id,{$pull:{carrito:{}}},(err,usuarioE)=>{
               if(err) return res.status(500).send({message: 'Error al editar Usuario: '+err})
            })

            factura.save((err,FacturaS)=>{
                if(err) return res.status(500).send({message: 'Error al guardar Factura: '+err})
                if(!FacturaS) return res.status(404).send({message:'No se ha guardado la factura'})
                if(FacturaS) return res.status(200).send({message:FacturaS})
            })
        })
    })
}

 function generarPDF(req,res){
    var pdf = new PDFKit
    var cont = 0

    Factura.findById(req.params.id).populate('productos.producto', 'usuario').exec((err,factura)=>{
        if(err) return res.status(500).send({message:'Error al buscar la factura: '+err})
        if(!factura) return res.status(404).send({message:'no se encontro la factura'})
        pdf.pipe(files.createWriteStream('C:/Users/monke/Desktop/Factura.pdf'))
        pdf.text('serie:'+factura.serie+' numero:'+factura.numero).fontSize(10)
        pdf.text('')
        pdf.text('Producto       |Cantidad|Precio Unitario|Subtotal').fontSize(25)
        do{
            pdf.text(factura.productos[cont].producto.nombre+'   |'+factura.productos[cont].cantidad+'|'+factura.productos[cont].producto.precio+'|'+factura.productos[cont].subtotal).fontSize(10)
            cont++
        }while(cont<factura.productos.length)
        console.log(cont);
        pdf.text(factura.usuario.nombre+' '+factura.usuario.apellido)
        pdf.end()
    })
}

function verfacturas(req,res){
    Factura.find({usuario:req.user.sub}).populate('productos.producto').exec((err,Facturas)=>{
        if(err) return res.status(500).send({message: 'Error al mostrar Factura: '+err})
        if(!Facturas) return res.status(404).send({message:'No se ha encontrado la factura'})
        if(Facturas) return res.status(200).send({message:Facturas})
    })
}

function verfactura(req,res){
    Factura.find({usuario:req.user.sub,_id:req.params.id}).populate('productos.producto').exec((err,Facturas)=>{
        if(err) return res.status(500).send({message: 'Error al mostrar Factura: '+err})
        if(!Facturas) return res.status(404).send({message:'No se ha encontrado la factura'})
        if(Facturas) return res.status(200).send({message:Facturas})
    })
}

function verVendidas(req,res){
    var resp = []
    Produ.find().sort('vendido'-1).exec((err,Facturas)=>{
        if(err) return res.status(500).send({message: 'Error al mostrar el producto: '+err})
        if(!Facturas) return res.status(404).send({message:'No se ha encontrado el producto'})
        resp.push(Facturas[0])
        resp.push(Facturas[1])
        resp.push(Facturas[2])
        return res.status(200).send({message:resp})
    })
}

function verAgotados(req,res){
    var resp = []
    Produ.find({cantidad:0}).exec((err,Facturas)=>{
        if(err) return res.status(500).send({message: 'Error al mostrar el producto: '+err})
        if(!Facturas||Facturas.length<1) return res.status(404).send({message:'No se ha encontrado el producto'})
        return res.status(200).send({message:Facturas})
    })
}

function verPorCategoria(req,res){
    Produ.find({Categoria:req.params.categ}).exec((err,producto)=>{
        if(err) return res.status(500).send({message:'Error al buscar los productos'+err})
        if(!producto) return res.status(404).send({message:'No se encotro el producto'})
        return res.status(200).send({message:producto})
    })
}

function produPorNombre(req,res){
    var params = req.body
    Produ.find({nombre:{$regex:params.nombre,$options:'xi'}},(err,Producto)=>{
        if(err) return res.status(500).send({message:'Error al buscar los productos'+err})
        if(!Producto) return res.status(404).send({message:'No se encotro el producto'})
        return res.status(200).send({message:Producto})
    })
}

module.exports = {
    ingresarFactura,
    generarPDF,
    verfacturas,
    verVendidas,
    verAgotados,
    verPorCategoria,
    produPorNombre,
    verfactura
}
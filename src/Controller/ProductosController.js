'use strict'

var  Productos = require('../Models/Productos')

function ingresarProducto(req,res){
    var params = req.body
    var Producto = new Productos

    if(req.user.rol!='Admin'){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }

    if(params.nombre!=null&&params.descripcion!=null&&params.precio!=null&&params.cantidad!=null&&params.Categoria!=null){
        Producto.nombre =params.nombre
        Producto.descripcion = params.descripcion
        Producto.precio = params.precio
        Producto.cantidad = params.cantidad
        Producto.Categoria = params.Categoria
        Productos.find({nombre:Producto.nombre}).exec((err,ProductoE)=>{
            if(err) return res.status(500).send({message: 'Error al buscar Productos'})
            if(ProductoE && ProductoE.length >=1){ return res.status(500).send({message: 'El producto ya existe'})
            }else{
                Producto.save((err,ProductoG)=>{
                    if(err) return res.status(500).send({message: 'Error al guardar Productos'})
                    if(!ProductoG) return res.status(500).send({message: 'El producto no se guardo'})
                    if(ProductoG) return res.status(200).send({message: ProductoG})
                })
            }
        })
    }else{
        return res.status(500).send({message: 'Compruebe los campos'})
    }
}

function editarProducto(req,res){
    var params = req.body 
    if(req.user.rol!='Admin'){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }

    Productos.findOneAndUpdate({_id:req.params.id},params,{new:true},(err,ProductoE)=>{
        if(err) return res.status(500).send({message: 'Error al buscar Productos'})
        if(!ProductoE) return res.status(404).send({message: 'El producto no se edito'})
        if(ProductoE) return res.status(200).send({message: ProductoE})
    })
}

function editarStock(req,res){
    var params = req.body 
    if(req.user.rol!='Admin'){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }

    Productos.findOneAndUpdate({_id:req.params.id},{$inc:{cantidad:params.cantidad}},{new:true},(err,ProductoE)=>{
        if(err) return res.status(500).send({message: 'Error al buscar Productos'})
        if(!ProductoE) return res.status(404).send({message: 'El producto no se edito'})
        if(ProductoE) return res.status(200).send({message: ProductoE})
    })
}

function eliminarProducto(req,res){
    if(req.user.rol!='Admin'){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }

    Productos.findOneAndDelete({_id:req.params.id},(err,ProductoE)=>{
        if(err) return res.status(500).send({message: 'Error al buscar Productos'})
        if(!ProductoE) return res.status(404).send({message: 'El producto no se elimino'})
        if(ProductoE) return res.status(200).send({message: ProductoE})
    })
}

function cambiarDef(req,res){
    Productos.updateMany({Categoria:req},{Categoria:'5e4b1c9a1ce91d127c53857d'},(err,ProductoE)=>{
        if(err) console.log('Error al buscar Productos')
        if(!ProductoE) console.log('El producto no se edito')
        if(ProductoE) console.log(ProductoE)
    })
}

module.exports = {
    ingresarProducto,
    editarProducto,
    eliminarProducto,
    cambiarDef,
    editarStock
}
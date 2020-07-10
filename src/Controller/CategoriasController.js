'use strict'

var Categorias = require('../Models/Categorias')
var ProductosC = require('./ProductosController')


function ingresarCategorias(req,res){
    var params = req.body
    var Categ = new Categorias

    if(req.user.rol=='Admin'){
        if(params.nombre != null){
            Categ.nombre = params.nombre
            Categ.descripcion = params.descripcion

            Categorias.find({nombre: Categ.nombre},(err,CategoriaEnc)=>{
                if(err) return res.status(500).send({message:'Error en la busqueda de la categoria'})
                if(CategoriaEnc && CategoriaEnc.length>=1) return res.status(404).send({message:'La categoria ya existe'})
                else{
                    Categ.save((err,CategoriaGuar)=>{
                        if(err) return res.status(500).send({message:'Error al guardar la categoria'})
                        if(!CategoriaGuar) return res.status(404).send({message:'La categoria no se guardo'})
                        if(CategoriaGuar) return res.status(200).send({message:CategoriaGuar})
                    })
                }
            })
        }else{
            return res.status(404).send({message:'llene todos los campos'})
        }
    }else{
        return res.status(404).send({message:'no tiene permiso'})
    }

}

function editarCategorias(req,res){
    var params = req.body

    if(req.user.rol!='Admin'){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }

    Categorias.findOneAndUpdate({_id:req.params.id},params,{new:true},(err,CategoriaEdit)=>{
        if(err) return res.status(500).send({message:'Error al editar la categoria'})
        if(!CategoriaEdit) return res.status(404).send({message:'La categoria no se guardo'})
        if(CategoriaEdit) return res.status(404).send({message:CategoriaEdit})
    })
}

function eliminarCategorias(req,res){

    if(req.user.rol!='Admin'){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }
    Categorias.findOneAndDelete({_id:req.params.id},(err,CategoriasElim)=>{
        if(err) return res.status(500).send({message:'Error al eliminar la categoria'})
        if(!CategoriasElim) return res.status(404).send({message:'La categoria no se eliminar'})
        if(CategoriasElim){
            createDef()
            ProductosC.cambiarDef(CategoriasElim._id)
            return res.status(404).send({message:CategoriasElim})
        } 
    })
}

function createDef(req,res){
    Categorias.findOne({nombre:'default'},(err,defaultCategory)=>{
        if(!defaultCategory){
            var def = new Categorias

            def._id = '5e4b1c9a1ce91d127c53857d'
            def.nombre = 'default'
            def.descripcion = 'Categoria default'
            def.save((erri,defa)=>{
                    if(erri) return res.status(500).send({message:'Error al guardar la categoria'})
                    if(!defa) return res.status(404).send({message:'La categoria no se guardo'})
            })
        }else{
           
        }
    })
}

function listar(req,res){
    Categorias.find({}).exec((err,CatE)=>{
        if(err) return res.status(500).send({message:'Error al editar la categoria'})
        if(!CatE) return res.status(404).send({message:'No se encontraron las categorias'})
        if(CatE) return res.status(200).send({message:CatE})
    })
}

module.exports = {
    ingresarCategorias,
    editarCategorias,
    eliminarCategorias,
    listar
}
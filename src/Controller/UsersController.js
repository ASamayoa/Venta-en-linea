'use strict'

var bcrypt = require('bcrypt-nodejs')
var Users = require('../Models/Usuario')
var Produ = require('../Models/Productos')
var jwt = require('../services/jwt')

function ingresarCliente(req,res){
    var params = req.body
    var usuario = new Users

    if(params.user != null && params.nombre != null && params.apellido != null && params.email != null && params.password != null){
        usuario.user = params.user
        usuario.nombre = params.nombre
        usuario.apellido = params.apellido
        usuario.email = params.email
        usuario.password = params.password
        usuario.totalCarrito = 0
        usuario.rol = 'Cliente'

        Users.find({$or:[{email:usuario.email, user:usuario.user}]}).exec((err,usuarioEncontrado)=>{
            if(err) return res.status(500).send({message: 'Error al buscar Usuarios'})
            if(usuarioEncontrado && usuarioEncontrado.length >=1) return res.status(500).send({message: 'El usuario ya existe'})
            else{
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                        usuario.password = hash

                        usuario.save((err,usuarioGuardado)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'})
                        if(usuarioGuardado) return res.status(200).send({usuarioGuardado})
                        else return res.status(500).send({message: 'No se ha encontrado el usuario'})
                        })
                        
                })
            } 
        })
    }else{
        return res.status(500).send({message:'Ingrese todos los datos'})
    }
}

function ingresarAdmin(req,res){
    var params = req.body
    var usuario = new Users

    if(params.user != null && params.nombre != null && params.apellido != null && params.email != null && params.password != null){
        usuario.user = params.user
        usuario.nombre = params.nombre
        usuario.apellido = params.apellido
        usuario.email = params.email
        usuario.password = params.password
        usuario.totalCarrito = 0
        usuario.rol = 'Admin'

        Users.find({$or:[{email:usuario.email, user:usuario.user}]}).exec((err,usuarioEncontrado)=>{
            if(err) return res.status(500).send({message: 'Error al buscar Usuarios'})
            if(usuarioEncontrado && usuarioEncontrado.length >=1) return res.status(500).send({message: 'El usuario ya existe'})
            else{
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                        usuario.password = hash

                        usuario.save((err,usuarioGuardado)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'})
                        if(usuarioGuardado) return res.status(200).send({usuarioGuardado})
                        else return res.status(500).send({message: 'No se ha encontrado el usuario'})
                        })
                        
                })
            } 
        })
    }else{
        return res.status(500).send({message:'Ingrese todos los datos'})
    }
    
}

function login(req,res){
    var params = req.body

    Users.findOne({email:params.email},(err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({message:'Error en la peticion de usuario'})
        if(!usuarioEncontrado) return res.status(404).send({message:'No existe ese usuario'})
        if(usuarioEncontrado){
            bcrypt.compare(params.password,usuarioEncontrado.password,(err,check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        })
                    }else{
                        usuarioEncontrado.password = undefined
                        return res.status(200).send({User: usuarioEncontrado})
                    }
                }else{
                    return res.status(404).send({message:'Usuario no identificado'})
                }
            })
        }
    
    })
}

function editarPerfil(req,res){
    var params = req.body

    if(req.params.id!=req.user.sub && req.user.rol!='Admin'){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }

    Users.findOneAndUpdate({_id: req.params.id},params,{new:true},(err, usuarioEdit)=>{
        if(err)  return res.status(500).send({message:'error en la edicion del usuario'})
        if(!usuarioEdit)  return res.status(500).send({message:'no se encontro el usuario'})
        if(usuarioEdit)  return res.status(500).send({message: usuarioEdit})
    })
}

function eliminarPerfil(req,res){
    if(req.params.id!=req.user.sub && req.user.rol!='Admin'){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }

    Users.findOneAndDelete({_id: req.params.id},(err, usuarioElim)=>{
        if(err)  return res.status(500).send({message:'error en la eliminacion del usuario'})
        if(!usuarioElim)  return res.status(500).send({message:'no se encontro el usuario'})
        if(usuarioElim)  return res.status(500).send({message: usuarioElim})
    })
}

function agregarCarrito(req,res){
    var params = req.body

    if(req.params.id!=req.user.sub){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }

    Users.findOne({_id:req.params.id,'carrito.producto':params.producto},(err,usuario)=>{
        if(err) return res.status(500).send({message: 'Error en la busqueda: '+err})
        if(!usuario||usuario!=null){

        Produ.findById(params.producto,(err,productoEnc)=>{
            if(err) return res.status(500).send({message: 'Error en la busqueda: '+err})
            if(!productoEnc) return res.status(404).send({message: 'No  se encontro el producto'})

            Users.findOneAndUpdate({_id:req.params.id},
                {$push:{carrito:{
                    cantidad:params.cantidad,
                    producto:params.producto,
                    subtotal:productoEnc.precio*params.cantidad}},
                    $inc:{totalCarrito:(productoEnc.precio*params.cantidad)}},
                    {new:true},
                    (err,usuarioEdit)=>{
                if(err) return res.status(500).send({message: 'Error en la edicion: '+err})
                if(!usuarioEdit) return res.status(404).send({message: 'No  se edito el usuario'})
                if(usuarioEdit) return res.status(200).send({message: usuarioEdit})
            })
        })
        }else{
            return res.status(500).send({message: 'Error, el producto ya esta en el carrito'})
        }
    })
}

function eliminarCarrito(req,res){
    var params = req.body

    if(req.params.id!=req.user.sub){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }
    Users.findOne({_id:req.params.id},(err,UsuarioE)=>{
        if(err) return res.status(500).send({message: 'Error en la busqueda: '+err})
        if(!UsuarioE) return res.status(404).send({message: 'No  se encontro el usuario'})

        var acum = UsuarioE.carrito[0]._id
        var cont = 0
        var resp = false
        var vueltas =UsuarioE.carrito.length
        
        do{
            if(UsuarioE.carrito[cont]._id==params.id){
                resp = true
            }
            acum = UsuarioE.carrito[cont].subtotal
            cont  = cont + 1
        }while(vueltas>cont&&resp==false)
        
        Users.findOneAndUpdate({_id:req.params.id},{$pull:{carrito:{_id:params.id}},$inc:{totalCarrito: -acum} },{new:true},(err,usuarioElim)=>{
            if(err) return res.status(500).send({message: 'Error en la edicion: '+err})
            if(!usuarioElim) return res.status(404).send({message: 'No  se edito el usuario'})
            if(usuarioElim) return res.status(200).send({message: usuarioElim})
        })
    })
}

function editarCarrito(req,res){
    var params = req.body

    if(req.params.id!=req.user.sub){
        return res.status(500).send({message:'No tiene permisos para realizar esta funcion'})
    }
    Users.findOne({_id:req.params.id}).populate('carrito.producto','precio').exec((err,UsuarioE)=>{
        if(err) return res.status(500).send({message: 'Error en la busqueda: '+err})
        if(!UsuarioE) return res.status(404).send({message: 'No  se encontro el usuario'})
        
        var acum
        var cont = 0
        var resp = false
        var vueltas =UsuarioE.carrito.length
        
        do{
            if(UsuarioE.carrito[cont].producto._id==params.producto){
                resp = true
                acum = UsuarioE.carrito[cont]
            }
            cont  = cont + 1
        }while(vueltas>cont&&resp==false)
        
        if(acum!=null){    
            Users.findOneAndUpdate({_id:req.params.id,'carrito.producto':params.producto},
                {'carrito.$.subtotal':acum.producto.precio*params.cantidad,
                'carrito.$.cantidad':params.cantidad,
                $inc:{totalCarrito:(acum.producto.precio*params.cantidad)-acum.subtotal}},
                {new:true},
                (err,CarritoE)=>{
                    if(err) return res.status(500).send({message: 'Error en la edicion: '+err})
                    if(!CarritoE) return res.status(404).send({message: 'No  se edito el usuario'})
                    if(CarritoE) return res.status(200).send({message: CarritoE})
                })
            }else{
                return res.status(500).send({message: 'Error, no se encontro el producto'})
            }
    })
}

function verUser(req,res){
    Users.findById(req.user.sub,(err,UsuarioE)=>{
        if(err) return res.status(500).send({message: 'Error en la busqueda: '+err})
        if(!UsuarioE) return res.status(404).send({message: 'No se encontro el usuario'})
        if(UsuarioE) return res.status(200).send({message: UsuarioE})
    })
}

function verCarrito(req,res){
    Users.findById(req.user.sub,(err,UsuarioE)=>{
        if(err) return res.status(500).send({message: 'Error en la busqueda: '+err})
        if(!UsuarioE) return res.status(404).send({message: 'No se encontro el usuario'})
        if(UsuarioE) return res.status(200).send({message: UsuarioE.carrito})
    })
}

function verTarjeta(req,res){
    Users.findById(req.user.sub,(err,UsuarioE)=>{
        if(err) return res.status(500).send({message: 'Error en la busqueda: '+err})
        if(!UsuarioE) return res.status(404).send({message: 'No se encontro el usuario'})
        if(UsuarioE) return res.status(200).send({message: UsuarioE.tarjetas})
    })
}

function agregarTarjeta(req,res){
    var params = req.body 

    if(params.nombre!=null&&params.numero.length==9&&params.numeroS.length==3){
        Users.findOneAndUpdate({_id:req.params.id},
            {$push:{tarjetas:{
                nombrePropietario:params.nombre,
                numero:params.numero,
                numeroSeguridad:params.numeroS}}},
                {new:true},
                (err,usuarioEdit)=>{
            if(err) return res.status(500).send({message: 'Error en la edicion: '+err})
            if(!usuarioEdit) return res.status(404).send({message: 'No  se edito el usuario'})
            if(usuarioEdit) return res.status(200).send({message: usuarioEdit})
        })
    }else{
        res.status(500).send({message: 'Error, revise los datos'})
    }
}

function eliminarTarjeta(req,res){
    var params = req.body

    Users.findOneAndUpdate({_id:req.params.id},{$pull:{tarjetas:{numero:params.numero}}},{new:true},(err,usuarioElim)=>{
        if(err) return res.status(500).send({message: 'Error en la edicion: '+err})
        if(!usuarioElim) return res.status(404).send({message: 'No  se edito el usuario'})
        if(usuarioElim) return res.status(200).send({message: usuarioElim})
    })
}

module.exports = {
    ingresarCliente,
    login,
    ingresarAdmin,
    editarPerfil,
    eliminarPerfil,
    agregarCarrito,
    eliminarCarrito,
    editarCarrito,
    agregarTarjeta,
    eliminarTarjeta,
    verUser,
    verCarrito,
    verTarjeta
}
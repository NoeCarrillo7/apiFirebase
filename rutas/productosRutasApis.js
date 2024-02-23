var rutasP=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivos");
//const fs = require('fs');
var {mostrarProductos, nuevoProducto, modificarProducto, borrarProducto, BuscarPorID}=require("../bd/productosBD");
 

//__________________MOSTRAR_______________________________

rutasP.get("/api/mostrarProductos",async(req, res)=>{
    var productos = await mostrarProductos();
    //res.render("productos/mostrar",{productos}); 
    if(productos.length>0)
        res.status(200).json(productos);
    else
        res.status(400).json("No hay productos")
});

//____________________NUEVO_______________________________________

rutasP.post("/api/nuevoProductos", subirArchivo(), async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await nuevoProducto(req.body);
    //res.redirect("/productos");
    if(error ==0)
        res.status(200).json("Producto Registrado");
    else
        res.status(400).json("Error el registrar producto");
});

//________________________BUSCAR___________________________________

rutasP.get("/api/buscarProductoPorId/:id",async(req,res)=>{
    var productos=await BuscarPorID(req.params.id);
    //res.render("usuarios/modificar",{user});
    if(productos==undefined)//undefine
        res.status(400).json("No se encontro el producto");
    else
        res.status(200).json(productos);
});

//___________________________EDITAR____________________________________

rutasP.post("/api/editarProductos",subirArchivo(),async(req,res)=>{
    
    if (req.file!=undefined){
        req.body.foto=req.file.originalname;
    }
    else{
        req.body.foto="algo"
    }
    console.log(req.file);

    var error=await modificarProducto(req.body);
    if(error==0){
        res.status(200).json("Producto actualizado");
    }
    else{
        res.status(400).json("Error al actualizar el producto");
    }
    /*var user= await BuscarPorID(req.body.id);
    if (user.foto!=req.file.originalname) {
        try {
            fs.unlinkSync(`web/images/${user.foto}`);
        } catch (error) {
            console.error("Error al borrar la foto o usuario:", error);
        }
    }
    req.body.foto=req.file.originalname;
    var errorProducto=await modificarProducto(req.body);
    //res.redirect("/productos");
    if(errorProducto==0)
        res.status(200).json("Producto Modificado");
    else
        res.status(400).json("Error el modificar producto");*/
});

//______________________________BORRAR______________________________

rutasP.get("/api/borrarProductos/:id",async(req,res)=>{
    var error=await borrarProducto(req.params.id);
    if(error==0){
        res.status(200).json("Producto borrado");
    }
    else{
        res.status(400).json("Error al borrar el producto")
    }
    /*var user= await BuscarPorID(req.params.id);
    try {
        fs.unlinkSync(`web/images/${user.foto}`);
    } catch (error) {
        console.error("Error al borrar la foto o usuario:", error);
    }
    var errorProducto= await borrarProducto(req.params.id);
    //res.redirect("/productos");
    if(errorProducto==0)
        res.status(200).json("Producto Borrado");
    else
        res.status(400).json("Error el borrar producto");*/
});

module.exports=rutasP;
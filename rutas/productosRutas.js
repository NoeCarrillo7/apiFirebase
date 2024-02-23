var rutasP=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivos");
var { mostrarProductos, nuevoProducto, BuscarPorID, modificarProducto, borrarProducto } = require("../bd/productosBD");

rutasP.get("/mostrarProductos",async(req,res)=>{
    var productos = await mostrarProductos();
    res.render("productos/mostrar",{productos});
});
 
rutasP.get("/nuevoproducto",async(req,res)=>{
    res.render("productos/nuevo");
});

rutasP.post("/nuevoproducto",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoProducto(req.body);
    res.redirect("/mostrarProductos");
});

rutasP.get("/editarproducto/:id",async(req, res)=>{
    var product=await BuscarPorID(req.params.id);
    res.render("productos/modificar",{product});
});

rutasP.post("/editarproducto",subirArchivo(), async(req,res)=>{
    if(req.file!=undefined){
        req.body.foto=req.file.originalname;
    }
    else{
        req.body.foto=req.body.fotoVieja;
    }
    var error=await modificarProducto(req.body);
    res.redirect("/mostrarProductos");
});

rutasP.get("/borrarproducto/:id", async(req,res)=>{
    await borrarProducto(req.params.id);
    res.redirect("/mostrarProductos");
});

module.exports=rutasP;
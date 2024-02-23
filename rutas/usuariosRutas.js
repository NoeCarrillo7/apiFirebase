var ruta=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivos");
//var {autorizado, admin}=require("../middlewares/funcionesPassword");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUsario, login}=require("../bd/usuariosBD");

ruta.post("/login",async(req,res)=>{
    var user=await login(req.body);
    if (user==undefined){
        res.redirect("/");
    }
    else{
        if(user.admin){
            console.log("Admin");
            req.session.admin=req.body.usuario;
            res.redirect("/nuevoProducto");
        }
        else{
            console.log("Usuario");
            req.session.usuario=req.body.usuario;
            res.redirect("/mostrarUsuarios");            
        }
        
    }
});

ruta.get("/logout", (req,res)=>{
    req.session=null;
    res.redirect("/");
});

//ruta.get("/mostrarUsuarios",autorizado,async(req,res)=>{
ruta.get("/mostrarUsuarios",async(req,res)=>{
    var usuarios = await mostrarUsuarios();
    res.render("usuarios/mostrar",{usuarios});
});

ruta.get("/nuevousuario",async(req,res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario",subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    //res.end();
    res.redirect("/mostrarUsuarios");
});

ruta.get("/editar/:id",async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    res.render("usuarios/modificar",{user});
});

ruta.post("/editar", subirArchivo(),async(req,res)=>{
    if(req.file!=undefined){
        req.body.foto=req.file.originalname;
    }
    else{
        req.body.foto=req.body.fotoVieja;
    }
    var error=await modificarUsuario(req.body);
    res.redirect("/mostrarUsuarios");
});

ruta.get("/borrar/:id", async(req,res)=>{
    await borrarUsario(req.params.id);
    res.redirect("/mostrarUsuarios");
});

ruta.get("/",(req,res)=>{
    res.render("usuarios/login");
});
 

module.exports=ruta;
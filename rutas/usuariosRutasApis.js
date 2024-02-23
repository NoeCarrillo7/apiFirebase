var ruta=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivos");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUsario}=require("../bd/usuariosBD");



//__________________MOSTRAR_______________________________

ruta.get("/api/mostrarUsuarios",async(req,res)=>{ 
    var usuarios = await mostrarUsuarios();
    //res.render("usuarios/mostrar",{usuarios});
    if(usuarios.length>0)
        res.status(200).json(usuarios);
    else
        res.status(400).json("No hay usuarios");
    
});

//____________________NUEVO_______________________________________

ruta.post("/api/nuevousuario",subirArchivo(),async(req,res)=>{
    console.log("Servidor /api/nuevousuario");
    console.log(req.body);
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    if(error==0){
        res.status(200).json("usuario registrado");
    }
    else{
        res.status(400).json("datos incorrectos");
    }
});

//________________________BUSCAR___________________________________

ruta.get("/api/buscarUsuarioPorId/:id",async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    //console.log(user);
    //res.render("usuarios/modificar",{user});
    if (user==""){
        res.status(400).json("No se encontró ese usuario");
    }
    else{
        res.status(200).json(user);
    }
});

//___________________________EDITAR____________________________________

ruta.post("/api/editarUsuario", subirArchivo(),async(req,res)=>{
    console.log("Entra al servidor a /api/editarUsuario");
    if (req.file!=undefined){
        req.body.foto=req.file.originalname;
    }
    else{
        req.body.foto="algo"
    }

    var error=await modificarUsuario(req.body);
    if(error==0){
        res.status(200).json("Usuario actualizado");
    }
    else{
        res.status(400).json("Error al actualizar el usuario");
    }
});

//______________________________BORRAR______________________________

ruta.get("/api/borrarUsuario/:id", async(req,res)=>{
    var error=await borrarUsario(req.params.id);
    if(error==0){
        res.status(200).json("Usuario borrado");
    }
    else{
        res.status(400).json("Error al borrar el usuario")
    }
});

module.exports=ruta;
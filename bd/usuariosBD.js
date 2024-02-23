var conexion=require("./conexion").conexionUsuarios;
var Usuario=require("../modelos/Usuario");
var {encriptarPassword, validarPassword}=require("../middlewares/funcionesPassword");

 
async function mostrarUsuarios(){
    var users=[];
    try{
        var usuarios=await conexion.get();
        usuarios.forEach(usuario => {
            var user=new Usuario(usuario.id, usuario.data());
            if (user.bandera==0){
                users.push(user.obtenerDatos);
            }
        });
    }
    catch(err){
        console.log("Error al recuperar usuarios de la BD "+err);
    }
    return users;
}

async function buscarPorID(id){
    var user;
    try{
        var usuario=await conexion.doc(id).get();
        var usuarioObjeto=new Usuario(usuario.id, usuario.data());
        if (usuarioObjeto.bandera==0){
            user=usuarioObjeto.obtenerDatos;
        }
    }
    catch(err){
        console.log("Error al recuperar al usuario (buscar por ID) "+err);
    }
    return user;
}

async function nuevoUsuario(datos){
    var {hash, salt}=encriptarPassword(datos.password);
    datos.password=hash;
    datos.salt=salt;
    datos.admin=false;
    //console.log(datos);
    var user=new Usuario(null,datos);
    var error=1;
    if (user.bandera==0){ 
        try{
            await conexion.doc().set(user.obtenerDatos);
            console.log("Usuario insertado a la BD");
            error=0;
        }
        catch(err){
            console.log("Error al capturar el nuevo usuario "+err);
        }
    }
    return error;
}

async function modificarUsuario(datos){
    var error=1;
    var respuestaBuscar=await buscarPorID(datos.id);
    console.log(respuestaBuscar);
    if(respuestaBuscar!=undefined){
        if(datos.foto=="algo"){
            datos.foto=respuestaBuscar.foto;
        }
        console.log("------ password ------------");
        console.log(datos.password);
        datos.admin=respuestaBuscar.admin;
        if(datos.password==""){
            datos.password=datos.passwordViejo;
            datos.salt=datos.saltViejo;
        }
        else{
            var {salt, hash}=encriptarPassword(datos.password);
            datos.password=hash;
            datos.salt=salt;
        }
        var user=new Usuario(datos.id,datos);
        if (user.bandera==0){
            try{
                await conexion.doc(user.id).set(user.obtenerDatos);
                console.log("Usuario actualizado ");
                error=0;
            }
            catch(err){
                console.log("Error al modificar al usuario "+err);
            }
        }
    }
    return error;
}

async function borrarUsario(id){
    var error=1;
    var user=await buscarPorID(id);
    if (user!=undefined){
        try{
            await conexion.doc(id).delete();
            console.log("Registro borrado ");
            error=0;
        }
        catch(err){
            console.log("Error al borrar al usuario "+err);
        }
    }
    return error;
}

async function login(datos){
    var user=undefined;
    var usuarioObjeto;
    try{
        var usuarios=await conexion.where('usuario','==',datos.usuario).get();
        if(usuarios.docs.length==0){//No existe el usuario
            return undefined
        }
        usuarios.docs.filter((doc) => {//El usuario SI existe
            var validar=validarPassword(datos.password,doc.data().password,doc.data().salt);
            if(validar){
                
                usuarioObjeto=new Usuario(doc.id, doc.data());
                if (usuarioObjeto.bandera==0){
                    user=usuarioObjeto.obtenerDatos;
                }
            }
            else
                return undefined;
        });        
    }
    catch(err){
        console.log("Error al recuperar al usuario "+err);
    }
    return user;
}

module.exports={
    mostrarUsuarios,
    buscarPorID,
    nuevoUsuario,
    modificarUsuario,
    borrarUsario,
    login
}
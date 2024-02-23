var conexion=require("./conexion").conexionProductos;
var Producto=require("../modelos/Producto");

async function mostrarProductos(){ 
    var products=[];
    try{ 
        var productos=await conexion.get();
        productos.forEach(producto => { 
            var product=new Producto(producto.id, producto.data());
            if (product.bandera==0){
                products.push(product.obtenerDatos);
            }
        });        
    }
    catch(err){
        console.log("Error al recuperar productos de la BD "+err);
    }
    return products;
}

async function BuscarPorID(id){
    var product;
    try{
        var producto=await conexion.doc(id).get();
        var productoObjeto=new Producto(producto.id, producto.data());
        if (productoObjeto.bandera==0){
            product=productoObjeto.obtenerDatos;
        }
    }
    catch(err){
        console.log("Error al recuperar al producto "+err);
    }
    return product;
}

async function nuevoProducto(datos){
    var product=new Producto(null,datos);
    var error=1;
    if (product.bandera==0){
        try{
            await conexion.doc().set(product.obtenerDatos);
            console.log("Producto insertado a la BD");
            error=0;
        }
        catch(err){
            console.log("Error al capturar el nuevo producto "+err);
        }
    }
    return error;
}

async function modificarProducto(datos){ 
    
    var error=1;
    var respuestaBuscar=await BuscarPorID(datos.id);
    console.log(respuestaBuscar);
    if(respuestaBuscar!= undefined){
        if(datos.foto=="algo"){
            datos.foto=respuestaBuscar.foto;
        }   
        var product=new Producto(datos.id,datos);
        if (product.bandera==0){
        
            try{
                await conexion.doc(product.id).set(product.obtenerDatos);
                console.log("Producto actualizado ");
                error=0;
            }
            catch(err){
                console.log("Error al modificar al producto "+err);
            }
        }
    }
    
    return error;
}

async function borrarProducto(id){
    var product=await BuscarPorID(id);
    if (product!=undefined){
        try{
            await conexion.doc(id).delete();
            console.log("Registro borrado ");
            error=0;
        }
        catch(err){
            console.log("Error al borrar al producto "+err);
        }
    }
    return error;
}

module.exports={
    mostrarProductos,
    BuscarPorID,
    nuevoProducto,
    modificarProducto,
    borrarProducto
}
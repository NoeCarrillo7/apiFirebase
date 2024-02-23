var express=require("express");
var cors=require("cors");

var path=require("path");
var session=require("cookie-session");
//var session=require("express-session"); Se almacena en el servidor
require("dotenv").config();
var rutasUsuarios=require("./rutas/usuariosRutas");
var rutasProductos=require("./rutas/productosRutas");
var rutasUsuariosApis=require("./rutas/usuariosRutasApis");
var rutasProductosApis= require("./rutas/productosRutasApis")

var app=express();
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name:'session',
    keys:['kajdshf786ADS'],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use("/", express.static(path.join(__dirname,"/web")))
app.use("/",rutasUsuarios);
app.use("/",rutasProductos);
app.use("/",rutasUsuariosApis);
app.use("/", rutasProductosApis)


var port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});



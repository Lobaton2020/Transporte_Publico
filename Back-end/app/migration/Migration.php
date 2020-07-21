<?php 

class Tables {

    public static function getFiedsRoles(){
        return ["rol","idrol","nombre"];
    }
    public static function getFiedsUsers(){
        return ["usuario","idusuario","idrol","nombrecompleto","correo","contrasena","imagen","telefono"];
    }

    public static function getFiedsContracts(){
        return ["contrato","idcontrato","idusuario","fechainicio","fechatermino","empresa","valortotal"];
    }
    
    public static function getFiedsBuses(){
        return ["bus","placa","idusuario","color","modelo","fabricante"];
    }
    
    public static function getFiedsRoutes(){
        return ["ruta","idruta","nombre","lugarpartida","lugarllegada"];
    }
    
    public static function getFiedsRoutesBuses(){
        return ["rutabus","idruta","idbus","fechapartida","fechallegada"];
    }
}
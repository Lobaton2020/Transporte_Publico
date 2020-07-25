<?php

class Authentication
{
    private $checkSession = false;
    protected $id;
    protected $rol;
    protected $name;
    protected $email;
    protected $image;
    

    protected function __construct()
    {
        $llave = uniqid(uniqid(uniqid()));
        session_name("transpublic_sessid");
        // session_id($llave);
        // setcookie(session_name(),session_id(),time()+(60*60*24*180),"/");
        session_start();
        $this->otherCookies();
        if (isset($_SESSION["activeSession"]) && isset($_SESSION["user_data_credentials"])) {
            if ($_SESSION["activeSession"] == true) {
                $this->checkSession = true;
                $this->id = $_SESSION["user_data_credentials"]["id"];
                $this->rol = $_SESSION["user_data_credentials"]["rol"];
                $this->name = $_SESSION["user_data_credentials"]["name"];
                $this->email = $_SESSION["user_data_credentials"]["email"];
                $this->image = $_SESSION["user_data_credentials"]["image"];
            }
        }
    }

    protected function updateSession($datauser){
        if (isset($_SESSION["activeSession"]) && isset($_SESSION["user_data_credentials"])) {
            if ($_SESSION["activeSession"] == true) {
                $_SESSION["user_data_credentials"]["name"] = $datauser[0];
                $_SESSION["user_data_credentials"]["email"] = $datauser[1];
                $_SESSION["user_data_credentials"]["image"] = $datauser[2];
            }
        }
    }

    private function otherCookies(){
        setcookie("ultima_visita",date("Y-m-d_H-m-i"),time()+(60*60*24*180),"/");
        if(isset($_COOKIE["num_peticiones"])){
            setcookie("num_peticiones",$_COOKIE["num_peticiones"] +=1,time()+(60*60*24*180),"/");
        }else{
            setcookie("num_peticiones",1,time()+(60*60*24*180),"/");
        }
    }

    protected function checkSession()
    {
        return $this->checkSession;
    }

    protected function getSession()
    {
        return $_SESSION;
    }

    protected function setSession($datauser)
    {
        try {
                $_SESSION["user_data_credentials"]["id"] = $datauser[0];
                $_SESSION["user_data_credentials"]["rol"] = $datauser[1];
                $_SESSION["user_data_credentials"]["name"] = $datauser[2];
                $_SESSION["user_data_credentials"]["email"] = $datauser[3];
                $_SESSION["user_data_credentials"]["image"] = $datauser[4];
                $_SESSION["activeSession"] = true;
            return true;
        } catch (Exception $e) {
            exit("Error " . $e->getMessage());
        }

    }

    protected function destroySession()
    {
        try {
            $_SESSION["user_data_credentials"] = null;
            $_SESSION["activeSession"] = false;
            setcookie(session_name(),session_id(),time()-(60*60*24*180),"/");
            session_destroy();
            return true;
        } catch (Exception $e) {
            exit("Error " . $e->getMessage());
        }
    }

}

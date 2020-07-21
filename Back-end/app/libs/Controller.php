<?php

class Controller extends Authentication
{
    protected function __construct()
    {
        parent::__construct();
    }

    protected function httpResponseError($description = "",$type = "")
    {
        if(empty($description)){
            $description = "Error, source not found. Access denied";
        }
        
        if(empty($type)){
            $type = "Error. Access denied";
        }
            
        return new ConvertJSON(["response" => [
            "protocol" => "http",
            "description" => $description,
            "state" => 404,
            "type" => $type,
            "suggest" => "try do loggin"
        ]
    ]);
    }

    protected function httpResponse()
    {
        return new ConvertJSON([
            "response"=>[
                "protocol" => "http",
                "state" => 200,
                "type" => "success"
            ]
        ]);
    }
    protected function httpResponseErrorAuth()
    {
        return new ConvertJSON(["response" => [
            "protocol" => "http",
            "description" => "Error of authentication",
            "state" => 403,
            "type" => "Error",
            "suggest" => "try do loggin"
        ]
    ]);
    }
    protected function verify_authentication()
    {
        if (!$this->checkSession()) {
            exit($this->httpResponseErrorAuth()->json());
        }

    }

    protected function model($model)
    {
        $model = ucwords($model) . "Model";
        if (file_exists("../app/models/" . $model . ".php")) {
            require_once "../app/models/" . $model . ".php";
            return new $model();
        } else {
            exit("Modelo no encontrado");
        }
    }

    protected function view($view, $params = [])
    {
        if (file_exists("../app/views/pages/" . $view . ".php")) {
            require_once "../app/views/pages/" . $view . ".php";
        } else {
            exit("Vista no encontrada");
        }
    }

    protected function redirect($path)
    {
        echo "<script>window.location.href = '" . URL_PROJECT . $path . "'</script>";
    }

}

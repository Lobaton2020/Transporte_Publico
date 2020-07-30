<?php

class Controller extends Authentication
{
    protected function __construct()
    {
        parent::__construct();
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

    protected function verify_authentication()
    {
        if (!$this->checkSession()) {
            exit($this->httpResponse("auth")->json());
        }

    }

    public function rol_conductor_not_access()
    { // 1 admin 2 coo rutas 3 conductor
        if ($this->rol != 1 && $this->rol != 2) {
            exit($this->httpResponse("error", "forbbiden", "Your role do not have permission", 403)->json());
        }
    }

    public function rol_conductor_only_access()
    { // 1 admin 2 coo rutas 3 conductor
        if ($this->rol != 3) {
            exit($this->httpResponse("error", "forbbiden", "Your role do not have permission", 403)->json());
        }
    }

    public function rol_coor_routes_not_access()
    {

        if ($this->rol != 1 && $this->rol != 3) {
            exit($this->httpResponse("error", "forbbiden", "Your rol is not permission", 403)->json());
        }
    }

    protected function httpResponse($t = "error", $type = "", $description = "", $state = "")
    {
        switch ($t) {
            case "ok":
                if (empty($description)) {
                    $description = "Success, You have access";
                }
                if (empty($type)) {
                    $type = "logeed";
                }

                if (empty($state)) {
                    $state = 200;
                }
                break;
            case "auth": // de auntenticacion
                if (empty($description)) {
                    $description = "Error of authentication";
                }
                if (empty($type)) {
                    $type = "notauthentication";
                }
                if (empty($state)) {
                    $state = 403;
                }
                break;
            case "error":
            default:
                if (empty($description)) {
                    $description = "Error! source not found. Access denied";
                }
                if (empty($type)) {
                    $type = "errorunknown";
                }
                if (empty($state)) {
                    $state = 400;
                }
        }
        return new ConvertJSON(["response" => [
            "protocol" => "http",
            "description" => $description,
            "state" => $state,
            "type" => $type,

        ],
        ]);
    }

}

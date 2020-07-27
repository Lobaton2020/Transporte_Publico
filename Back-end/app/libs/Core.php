<?php
class Core
{
    private $controller = "AuthController";
    private $method = null;
    private $params = [];
    private $existMethod = true;

    public function __construct()
    {
        $this->params = $this->getUrl();
        $this->controller = $this->getController();
        $this->method = $this->getMethod();

        $this->params = $this->params ? array_values($this->params) : [];

        if ($this->existMethod) {
            echo call_user_func_array([$this->controller, $this->method], $this->params); //imprime lo que se retorna del controller y su metodo
        } else {
            echo toJSON(
                ["response" => [
                    "protocol" => "http",
                    "description" => "Method Not Found",
                    "state" => 404,
                    "type" => "methodnotfound",
                ],
                ]);
        }
    }

    private function getController($index = 0)
    {
        $controller = (isset($this->params[$index])) ? $this->params[$index] : null;
        if (isset($controller)) {
            if (file_exists("../app/controllers/" . ucwords($controller) . "Controller.php")) {
                $this->controller = ucwords($controller) . "Controller";
                unset($this->params[$index]);
            }
        }

        require_once "../app/controllers/" . $this->controller . ".php";
        return new $this->controller;
    }

    private function getMethod($index = 1)
    {
        $method = (isset($this->params[$index])) ? $this->params[$index] : null;
        if (isset($method)) {
            if (method_exists($this->controller, $method)) {
                $this->method = $method;
                unset($this->params[$index]);
            } else {
                $this->existMethod = false;
            }
        } else {
            $this->existMethod = false;
        }
        return $this->method;
    }

    private function getUrl()
    {
        if (isset($_GET["url"])) {

            $url = rtrim($_GET["url"]);
            $url = filter_var($url, FILTER_VALIDATE_URL);
            $url = explode("/", $_GET["url"]);
            return $url;
        }
    }
}

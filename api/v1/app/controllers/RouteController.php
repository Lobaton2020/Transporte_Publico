<?php

class RouteController extends Controller implements Crud, Route
{

    private $model;
    public function __construct()
    {
        parent::__construct();
        $this->verify_authentication();
        $this->rol_conductor_not_access();
        $this->model = $this->model("route");
    }

    public function all()
    {

        return $this->model->getAll()->json();
    }

    public function get($value)
    {
        try {
            $data = $this->model->getByLikeLimit(["idruta", "nombre"], $value)->normalArray();
            if (empty($data)) :
                throw new Exception("Error");
            endif;
            return toJSON($data);
        } catch (Exception $e) {
            return $this->httpResponse("error", "fieldnotfound", "Field not found", 404)->json();
        }
    }
    public function save()
    {

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $datos = $_POST;
            $datos = array_values($datos);
            if (is_fieldEmpty($datos)) {
                return $this->httpResponse("error", "fieldempty", "rol empty client")->json();
            }
            $fields = Tables::getFiedsRoutes();
            if ($this->model->save($fields, $datos)) {
                return $this->httpResponse("ok", "registered", "route saved correctly")->json();
            } else {
                return $this->httpResponse("error", "notregistered", "the route clouldn't be saved")->json();
            }
        } else {
            return $this->httpResponse("error", "invalidmethod", "The method should be POST not GET")->json();
        }
    }
    public function update()
    {
    }
}

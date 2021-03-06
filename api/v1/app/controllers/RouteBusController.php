<?php

class RouteBusController extends Controller implements RouteBus
{

    private $model;
    public function __construct()
    {
        parent::__construct();
        $this->verify_authentication();
        $this->model = $this->model("routebus");
    }

    public function byuser()
    {
        $this->rol_conductor_only_access();
        $bus = $this->model->getByTable("bus", "idusuario", $this->id)->normal();
        $placa = (!empty($bus)) ? $bus->placa : false;
        if ($placa) {
            $rutabus = $this->model->getBy("idbus", $placa)->normal();
            $rutabus = (is_array($rutabus)) ? $rutabus : [$rutabus];

            for ($i = 0; $i < count($rutabus); $i++) {
                $rutabus[$i]->rutas["ruta"] = $this->model->getByTable("ruta", "idruta", $rutabus[$i]->idruta)->normal();
            }
            $bus = ["bus" => $this->model->getByTable("bus", "placa", $rutabus[0]->idbus)->normal()];
            array_push($rutabus, $bus);
            return toJSON(array_reverse($rutabus));
        } else {
            return $this->httpResponse("error", "fieldnotfound", "Field not found", 404)->json();
        }
    }

    public function all()
    {
        $this->rol_conductor_not_access();
        $data = array();
        foreach ($this->model->getAll()->normalArray() as $rutabus) {
            $rutabus->ruta = $this->model->getByTable("ruta", "idruta", $rutabus->idruta)->normal();
            $rutabus->idusuario = $this->model->getByTable("bus", "placa", $rutabus->idbus)->normal()->idusuario;
            $rutabus->userTest = $this->model->getByTable("usuario", "idusuario", $rutabus->idusuario)->normal();
            $rutabus->usuario = new stdClass();
            $rutabus->usuario->nombrecompleto = $rutabus->userTest->nombrecompleto;
            $rutabus->usuario->correo = $rutabus->userTest->correo;
            $rutabus->usuario->imagen = $rutabus->userTest->imagen;
            array_push($data, $rutabus);
            unset($rutabus->userTest);
        }
        return toJSON($data);
    }

    public function get($idruta, $idbus)
    {
        $this->rol_conductor_only_access();
        try {
            $data = $this->model->getroutebus($idruta, $idbus);
            if (empty($data)) :
                throw new Exception("Error");
            endif;
            $bus = $this->model->getByTable("bus", "placa", $data->idbus)->normal();
            $ruta = $this->model->getByTable("ruta", "idruta", $data->idruta)->normal();
            if ($bus->idusuario != $this->id) {
                return $this->httpResponse("error", "Route not corresponded", "Field not found", 404)->json();
            }
            $data->bus = $bus;
            $data->ruta = $ruta;
            return toJSON($data);
        } catch (Exception $e) {
            return $this->httpResponse("error", "fieldnotfound", "Field not found", 404)->json();
        }
    }

    public function save()
    {
        $result = true;
        $this->rol_conductor_not_access();

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $datos = $_POST;
            $datos = array_values($datos);
            $datosCopy = $datos;
            if (is_fieldEmpty($datos)) {
                return $this->httpResponse("error", "fieldempty", "rol empty client")->json();
            }
            $fields = unitArray(["as"], Tables::getFiedsRoutesBuses());
            foreach ($datosCopy[1] as $placa) {
                if ($this->model->existByCond(["idruta", $datos[0]], ["idbus", $placa])) {
                    return $this->httpResponse("ok", "alreadyexistregister ", "error not saved se resource")->json();
                    break;
                }
            }
            foreach ($datosCopy[1] as $placa) {
                $datos[1] = $placa;
                if (!$this->model->save($fields, $datos)) {
                    $result = false;
                }
            }
            if ($result) {
                return $this->httpResponse("ok", "registered", "routebus saved correctly")->json();
            } else {
                return $this->httpResponse("error", "notregistered", "the routebus clouldn't be saved")->json();
            }
        } else {
            return $this->httpResponse("error", "invalidmethod", "The method should be POST not GET")->json();
        }
    }
}

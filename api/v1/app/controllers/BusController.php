<?php
class BusController extends Controller implements Crud, Bus
{

    private $bus;
    public function __construct()
    {
        parent::__construct();
        $this->verify_authentication();
        $this->model = $this->model("bus");
    }

    public function all()
    {
        $this->rol_conductor_not_access();

        $user = $this->model("user");
        $datos = $this->model->getAll()->normal();
        $datos = (is_array($datos)) ? $datos : [$datos];

        foreach ($datos as $dato) {
            $dato->usuario = $user->getBy("idusuario", $dato->idusuario)->normal();
        }
        return toJSON($datos);
    }

    public function get($placa)
    {
        $user = $this->model("user");
        try {
            $data = $this->model->getBy("placa", $placa)->normal();
            if (empty($data)):
                throw new Exception("Error");
            endif;
            $data->usuario = $user->getBy("idusuario", $data->idusuario)->normal();
            if (($data->usuario->idusuario != $this->id && $this->rol == 3)) {
                return $this->httpResponse("error", "notpermission", "you do not have access", 404)->json();
            }
            return toJSON($data);
        } catch (Exception $e) {
            return $this->httpResponse("error", "fieldnotfound", "Field not found", 404)->json();
        }
    }

    public function exists()
    {
        $this->rol_conductor_only_access();
        $user = $this->model("user");
        try {
            $data = $this->model->getBy("idusuario", $this->id)->normal();
            if (empty($data)):
                throw new Exception("Error");
            endif;
            $usuario = $user->getBy("idusuario", $data->idusuario)->normal();
            if (($usuario->idusuario != $this->id && $this->rol == 3)) {
                return $this->httpResponse("error", "notpermission", "you do not have access", 404)->json();
            }
            return toJSON($data);
        } catch (Exception $e) {
            return $this->httpResponse("error", "fieldnotfound", "Field not found", 404)->json();
        }
    }

    public function save()
    {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            $user = $this->model("user");
            $datos = array_values($_POST);
            if (is_fieldEmpty($datos)) {
                return $this->httpResponse("error", "fieldempty", "empty fileds client")->json();
            }

            $fields = unitArray(["invalid"], Tables::getFiedsBuses());
            if (!$this->model->exist(["placa", $datos[0]])) {

                if ($user->exist(["idusuario", $datos[1]])) {

                    if ($this->model->save($fields, $datos)) {
                        return $this->httpResponse("ok", "registered", "bus registered success")->json();
                    } else {
                        return $this->httpResponse("error", "notregistered", "bus not registered")->json();
                    }
                } else {
                    return $this->httpResponse("error", "notexistsregister", "the user not exists")->json();
                }
            } else {
                return $this->httpResponse("error", "alreadyexistregister ", "the bus already exists")->json();
            }

        } else {
            return $this->httpResponse("error", "invalidmethod", "The method should be POST not GET")->json();
        }
    }

    public function update()
    {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $datos = array_values($_POST);
            if (is_fieldEmpty($datos)) {
                return $this->httpResponse("error", "fieldempty", "empty fileds client")->json();
            }
            $fields = ["fechainicio", "fechatermino", "valortotal"];
            $id = $datos[0];unset($datos[0]);

            if ($this->model->exist(["idcontrato", $id])) {
                if ($this->model->update($fields, $datos, ["idcontrato", $id])) {
                    return $this->httpResponse("ok", "updated", "contract renoveded success")->json();
                } else {
                    return $this->httpResponse("error", "notupdated", "contract not renoveded")->json();
                }
            } else {
                return $this->httpResponse("error", "notexistsregister", "the contract not exists")->json();
            }

        } else {
            return $this->httpResponse("error", "invalidmethod", "The method should be POST not GET")->json();
        }
    }

}

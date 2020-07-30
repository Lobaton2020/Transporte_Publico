<?php

class ContractController extends Controller implements Crud, Contract
{

    private $model;
    public function __construct()
    {
        parent::__construct();
        $this->verify_authentication();
        $this->rol_coor_routes_not_access();
        $this->model = $this->model("contract");

    }

    public function all()
    {
        $this->rol_conductor_not_access();
        $user = $this->model("user");
        $datos = $this->model->getAll()->normal();
        $datos = (is_array($datos)) ? $datos : [$datos];

        foreach ($datos as $item) {
            $item->usuario = $user->getBy("idusuario", $item->idusuario)->normal();
        }
        return toJSON($datos);
    }

    public function get($id)
    {

        $user = $this->model("user");
        try {
            $data = $this->model->getBy("idcontrato", $id)->normal();
            if (empty($data)):
                throw new Exception("Error");
            endif;
            $data->usuario = $user->getBy("idusuario", $data->idusuario)->normal();
            return toJSON($data);
        } catch (Exception $e) {
            return $this->httpResponse("error", "fieldnotfound", "Field not found", 404)->json();
        }
    }

    public function save()
    {
        $this->rol_conductor_not_access();

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $datos = array_values($_POST);
            if (is_fieldEmpty($datos)) {
                return $this->httpResponse("error", "fieldempty", "empty fileds client")->json();
            }
            $fields = Tables::getFiedsContracts();
            if ($this->model->save($fields, $datos)) {
                return $this->httpResponse("ok", "registered", "contract registered success")->json();
            } else {
                return $this->httpResponse("error", "notregistered", "contract not registered")->json();
            }

        } else {
            return $this->httpResponse("error", "invalidmethod", "The method should be POST not GET")->json();
        }
    }

    public function renew()
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

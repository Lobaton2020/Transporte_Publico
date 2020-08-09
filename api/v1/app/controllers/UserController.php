<?php

class UserController extends Controller implements Crud, User
{
    private $model;
    public function __construct()
    {
        parent::__construct();
        $this->model = $this->model("user");
        //$this->verify_authentication();
    }

    public function all()
    {
        $this->rol_conductor_not_access();
        $datos = array();
        foreach ($this->model->getAll()->normalArray() as $user) {
            $newUser = new stdClass();
            $newUser->idusuario = $user->idusuario;
            $newUser->idrol = $user->idrol;
            $newUser->nombrecompleto = $user->nombrecompleto;
            $newUser->correo = $user->correo;
            $newUser->imagen = $user->imagen;
            $newUser->telefono = $user->telefono;

            array_push($datos, $newUser);
        }
        return toJSON($datos);
    }
    public function drivers($search)
    {
        $bus = $this->model("bus");
        $this->rol_conductor_not_access();
        $datos = array();
        foreach ($this->model->getByCondLikeLimit(["idrol", 3], ["correo", "nombrecompleto"], $search)->normalArray() as $user) {
            if (empty($bus->getBy("idusuario", $user->idusuario)->normal())) {

                $newUser = new stdClass();
                $newUser->idusuario = $user->idusuario;
                $newUser->idrol = $user->idrol;
                $newUser->nombrecompleto = $user->nombrecompleto;
                $newUser->correo = $user->correo;
                $newUser->imagen = $user->imagen;
                $newUser->telefono = $user->telefono;
                array_push($datos, $newUser);
            }
        }
        return toJSON($datos);
    }

    public function users($search)
    {
        $this->rol_conductor_not_access();
        $this->rol_coor_routes_not_access();
        $bus = $this->model("bus");
        $datos = array();
        foreach ($this->model->getByLikeLimit(["nombrecompleto", "correo"], $search)->normalArray() as $user) {
            // if (!$this->model->existByTable("contrato", ["idusuario", $user->idusuario])) {
            unset($user->contrasena);
            array_push($datos, $user);
            // }
        }
        return toJSON($datos);
    }

    public function get($id)
    {
        try {
            if ($this->id != $id) {
                $this->rol_conductor_not_access();
            }
            $data = $this->model->getBy("idusuario", $id)->normal();
            if (empty($data)) :
                throw new Exception("Error");
            endif;
            $user = new stdClass();
            $user->idusuario = $data->idusuario;
            $user->idrol = $data->idrol;
            $user->nombrecompleto = $data->nombrecompleto;
            $user->correo = $data->correo;
            $user->telefono = $data->telefono;
            return toJSON($user);
        } catch (Exception $e) {
            return $this->httpResponse("error", "fieldnotfound", "Field not found", 404)->json();
        }
    }

    public function save()
    {
        //$this->rol_conductor_not_access();
        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            $datos = array_values($_POST);
            $imagen = array_values($_FILES);
            $imagen = isset($imagen[0]) ? $imagen[0] : "";

            if (is_fieldEmpty($datos)) {
                return $this->httpResponse("error", "fieldempty", "empty fileds client")->json();
            }
            if (empty($imagen)) {
                return $this->httpResponse("error", "imagenotfound", "image not send from client")->json();
            }
            if (filter_var($datos[2], FILTER_VALIDATE_EMAIL) && empty($this->model->getBy("correo", $datos[2])->normal())) {

                if (strlen(end($datos)) > 20) {
                    return $this->httpResponse("error", "invalidcellphone", "not more of 20 characters of number the cellphone", 400)->json();
                }
                $fields = Tables::getFiedsUsers();
                $nameImg = $imagen["name"];
                array_push($datos, $datos[4]);
                $id = intval($this->model->maxId("idusuario")->maxid) + 1;
                $ruta = "images/" . $id . "_user_img/";
                $datos[4] = $ruta . $nameImg;
                $datos[3] = password_hash($datos[3], PASSWORD_BCRYPT, ['cost' => 10]);

                if (!file_exists($ruta)) {
                    mkdir($ruta, 0777, true);
                }
                if (move_uploaded_file($imagen["tmp_name"], $ruta . $nameImg)) {
                    if ($this->model->save($fields, $datos)) {
                        return $this->httpResponse("ok", "registered", "user registered successfully", 201)->json();
                    } else {
                        return $this->httpResponse("error", "notregistered", "user not registered")->json();
                    }
                } else {
                    return $this->httpResponse("error", "imagenotsaved", "the image is not storage")->json();
                }
            } else {
                return $this->httpResponse("error", "invalidemail", " the email is invalid")->json();
            }
        } else {
            return $this->httpResponse("error", "invalidmethod", "The method should be POST not GET")->json();
        }
    }

    public function update($type, $id = null)
    {

        if ($this->id != $id) {
            $this->rol_conductor_not_access();
        }

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            switch ($type) {
                case "text":
                    if ($this->rol != 3) { // representa al rol de conducor
                        ($id != null) ? $this->id = $id : "";
                    }
                    return $this->updateText($_POST);
                    break;
                case "pass":
                    return $this->updatePassword($_POST);
                    break;
                case 'image':
                    return $this->updateImage($_FILES);
                    break;
                default:
                    return $this->httpResponse("error", "parammethod", "The server not known that do")->json();
            }
        } else {
            return $this->httpResponse("error", "invalidmethod", "The method should be POST not GET")->json();
        }
    }

    public function updateText($datos)
    {
        $datos = array_values($datos);
        foreach ($datos as $data) {
            if (empty($data)) {
                return $this->httpResponse("error", "fieldempty", "empty fileds client")->json();
                break;
            }
        }
        $lastEmail = $this->model->getBy("idusuario", $this->id)->normal()->correo;
        if (filter_var($datos[1], FILTER_VALIDATE_EMAIL)) {
            if ($lastEmail == $datos[1] || $this->model->getByCount("correo", $datos[1]) == 0) {
                $fields = ["nombrecompleto", "correo", "telefono"];
                if ($this->model->update($fields, $datos, ["idusuario", $this->id])) {
                    $this->updateSession([$this->name, $datos[1], $this->image]);
                    return $this->httpResponse("ok", "updated", "user updated successfully", 201)->json();
                } else {
                    return $this->httpResponse("error", "notupdated", "user not updated")->json();
                }
            } else {
                return $this->httpResponse("error", "alreadyexistregister", " the email alreadyexists")->json();
            }
        } else {
            return $this->httpResponse("error", "invalidemail", " the email is invalid")->json();
        }
    }

    public function updatePassword($data)
    {
        $password = array_values($data)[0];
        if (strlen($password) < 100) {
            $password = password_hash($password, PASSWORD_BCRYPT);
            if ($this->model->update(["contrasena"], [$password], ["idusuario", $this->id])) {
                return $this->httpResponse("ok", "updated", "password updated successfully", 201)->json();
            } else {
                return $this->httpResponse("error", "notupdated", "password not updated")->json();
            }
        } else {
            return $this->httpResponse("error", "invalidpassword", "number of characters is more of 100")->json();
        }
    }

    public function updateImage($img)
    {
        if (empty($img)) {
            return $this->httpResponse("error", "imagenotfound", "image not send from client")->json();
        }
        $imagen = array_values($img)[0];
        $lastImg = $this->model->getBy("idusuario", $this->id)->normal()->imagen;
        $$newImg = str_replace("%" . basename($lastImg) . "%", $imagen["name"], $lastImg);

        if (unlink($lastImg)) {
            if (move_uploaded_file($imagen["tmp_name"], $newImg)) {
                if ($this->model->update(["imagen"], [$newImg], ["idusuario", $this->id])) {
                    $this->updateSession([$this->name, $this->email, $newImg]);
                    return $this->httpResponse("ok", "updated", "the imagen is updated", 500)->json();
                } else {
                    return $this->httpResponse("error", "notupdated", "error in server (save imag in DB)", 500)->json();
                }
            } else {
                return $this->httpResponse("error", "errorimage", "error in server (ulpload image)", 500)->json();
            }
        } else {
            return $this->httpResponse("error", "notupdated", "error in server (delete image old)", 500)->json();
        }
    }
}

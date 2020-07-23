<?php

class AuthController extends Controller implements Auth
{

    public function __construct()
    {
        parent::__construct();
        $this->model = $this->model("user");
    }
    
    public function see(){
        echo toJSON($this->getSession());
    }

    public function login(){
        if($_SERVER["REQUEST_METHOD"] == "POST"){
            $datos = array_values($_POST);
            if(filter_var($datos[0],FILTER_VALIDATE_EMAIL)){
                $user = $this->model->getBy("correo",$datos[0])->normal();
                if(!empty($user)){
                    if(password_verify($datos[1],$user->contrasena)){
                        $dataSession = [
                            $user->idusuario,
                            $user->idrol,
                            $user->nombrecompleto,
                            $user->correo,
                            $user->imagen
                        ];
                        if($this->setSession($dataSession)){
                            return $this->httpResponse("ok","logged","User logged successfully")->json();    
                        }else{
                            return $this->httpResponse("error","errorcreatesession","The password is incorrect")->json();    
                        }
                    }else{
                        return $this->httpResponse("error","invalidpassword","The password is incorrect")->json();    
                    }
                }else{
                    return $this->httpResponse("error","notexistemail","The email is incorrect")->json();
                }
            }else{
                return $this->httpResponse("error","invalidemail","The email is incorrect")->json();
            }
        }else{
            return $this->httpResponse("error","invalidmethod","Method invalid, The correct is POST")->json();
        }
    }

    public function logout(){
        if($this->destroySession()){
            return $this->httpResponse("ok","clossedsession","Clossed session Successfully")->json();
        }else{
            return $this->httpResponse("error","notclossedsession","Error to close session")->json();
        }
    }

}

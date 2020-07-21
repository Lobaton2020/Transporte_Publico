<?php

class UserController extends Controller
{
    private $model;
    public function __construct()
    {
        parent::__construct();
        $this->model = $this->model("user");
        $this->setSession(["nombre" =>"Juan perez"]);
        // $this->verify_authentication();
    }
    
    public function all()
    {
        return $this->model->getAll()->json();
    }


    public function get($id){
        try{
            $data = $this->model->getById("idusuario",$id)->json();
            if(empty(toArray($data))):
                  throw new Exception("Error");
             endif; 
             return $data;
        }catch(Exception $e){
            return $this->httpResponseError()->json();
        }
     }

    public function save(){

         if($_SERVER["REQUEST_METHOD"] == "POST"){
            $datos = $_POST;
            $imagen = $_FILES;
            foreach($datos as $data){
                if(empty($data) || empty($imagen)){
                    return $this->httpResponseError("empty fileds","Fields Client")->json();
                    break;
                }
            }
            if(filter_var($datos["email"],FILTER_VALIDATE_EMAIL)){
                $fields = Tables::getFiedsUsers();
                if($this->model->save($fields,$datos)){
                    return $this->httpResponse()->json();
                }else{
                    return $this->httpResponseError()->json();
                }
            }else{
                return $this->httpResponseError()->json();
            }
         }else{
            return $this->httpResponseError()->json();
         }
     }
}

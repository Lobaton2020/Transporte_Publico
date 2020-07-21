<?php
class RolController extends Controller{

    private $model;
    public function __construct()
    {
        parent::__construct();
        $this->model = $this->model("rol");
        $this->verify_authentication();
    }

    public function all(){
       return $this->model->getAll()->json();
    }

    public function get($id){
        try{
            $data = $this->model->getById("idrol",$id)->json();
            if(empty(toArray($data))):
                  throw new Exception("Error");
             endif; 
             return $data;
        }catch(Exception $e){
            return $this->httpResponseError()->json();
        }
     }
}
<?php
class RolController extends Controller implements Crud{

    private $model;
    public function __construct()
    {
        parent::__construct();
        $this->model = $this->model("rol");
        $this->verify_authentication();
        $this->rol_conductor_not_access();
        $this->rol_coor_routes_not_access();
    }

    public function all()
    {
       return $this->model->getAll()->json();
    }

    public function get($id){
        try{
            $data = $this->model->getBy("idrol",$id)->json();
            if(empty(toArray($data))):
                  throw new Exception("Error");
             endif; 
             return $data;
        }catch(Exception $e){
            return $this->httpResponse("error","fieldnotfound","Field not found",404)->json();
        }
     }
     
     public function save(){

        if($_SERVER["REQUEST_METHOD"] == "POST"){
            $datos = $_POST;
            $datos = array_values($datos);
            if(empty($datos[0])){
                return $this->httpResponse("error","fieldempty","rol empty client")->json();
           }
            $fields = Tables::getFiedsRoles();
            if($this->model->save($fields,$datos)){
                return $this->httpResponse("ok","registered","rol saved correctly")->json();
            }else{
                return $this->httpResponse("error","notregistered","the rol clouldn't be saved")->json();
            }
        }else{
         return $this->httpResponse("error","invalidmethod","The method should be POST not GET")->json();
        }
    }
}
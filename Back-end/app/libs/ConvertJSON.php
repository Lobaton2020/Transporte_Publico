<?php

class ConvertJSON {

    private $data;
    public function __construct($data)
    {
        $this->data = $data;
    }

    public function json(){
        return json_encode($this->data,true);
    }

    public function normal(){
        if(!empty($this->data)){
            if(count($this->data) == 1){
                return $this->data[0];
            }
            }
        return $this->data;
    }
}
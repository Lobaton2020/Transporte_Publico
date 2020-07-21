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
        return (Object)$this->data;
    }
}
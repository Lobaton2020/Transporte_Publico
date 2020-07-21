<?php
class BusController extends Controller{

    private $bus;
    public function __construct()
    {
        parent::__construct();
        $this->bus = $this->model("bus");
    }

    public function get(){
       var_dump((Array)$this->bus->getAll());
    }
}
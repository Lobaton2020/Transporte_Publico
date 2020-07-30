<?php

class RouteBusModel extends Orm
{
    public function __construct()
    {
        parent::__construct("rutabus");
    }

    public function getroutebus($idruta, $idbus)
    {
        try {
            $this->querye("SELECT * FROM rutabus WHERE idruta = :idruta and idbus = :idbus");
            $this->bind(":idruta", $idruta);
            $this->bind(":idbus", $idbus);
            $this->execute();
            return $this->fetch();
        } catch (Exception $e) {
            return false;
        }
    }
}

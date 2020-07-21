<?php

class Orm extends Base
{

    private $table;

    public function __construct($table)
    {
        parent::__construct();
        $this->table = $table;
    }

    public function getAll($type = "asc")
    {
        $this->querye("SELECT * FROM {$this->table} ORDER BY '{$type}'");
        $this->execute();
        return new ConvertJSON($this->fetchAll());
    }

    public function getById($id, $value)
    {
        $this->querye("SELECT * FROM {$this->table} WHERE {$id} = :idvalue");
        $this->bind(":idvalue", $value);
        $this->execute();
        return new ConvertJSON($this->fetchAll());
    }

    public function getBy($column, $value)
    {
        $this->querye("SELECT * FROM {$this->table} WHERE {$column} = :columnvalue");
        $this->bind(":columnvalue", $value);
        $this->execute();
        return new ConvertJSON($this->fetchAll());
    }

    public function deleteById($id, $value)
    {
        $this->querye("DELETE FROM {$this->table} WHERE {$id} = :idcolumn");
        $this->bind(":idcolumn", $value);
        return $this->execute();
    }

    public function deleteBy($column, $value)
    {
        $this->querye("SELECT * FROM {$this->table} WHERE {$column} = :columnvalue");
        $this->bind(":columnvalue", $value);
        return $this->execute();
    }

    public function save($fields,$data)
    {
        $table = $fields[0];
        unset($fields[0]);
        unset($fields[1]);

        $fieldNames = implode(",",$fields);
        $fieldValues = ":".implode(", :",$fields);
        $sql = "INSERT INTO {$table} ({$fieldNames}) VALUES ({$fieldValues})";
        var_dump($sql,$data);
        exit;
    }

    // aqui pueden ir otros metodos automaticos
    // metodos para actualizar datos con bucles
}

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
        try {
            $this->querye("SELECT * FROM {$this->table} ORDER BY '{$type}'");
            $this->execute();
            return new ConvertJSON($this->fetchAll());
        } catch (Exception $e) {
            return false;
        }
    }

    public function getBy($column, $value)
    {
        try {
            $this->querye("SELECT * FROM {$this->table} WHERE {$column} = :columnvalue");
            $this->bind(":columnvalue", $value);
            $this->execute();
            return new ConvertJSON($this->fetchAll());
        } catch (Exception $e) {
            return false;
        }
    }

    public function getByTable($table, $column, $value)
    {
        try {
            $this->querye("SELECT * FROM {$table} WHERE {$column} = :columnvalue");
            $this->bind(":columnvalue", $value);
            $this->execute();
            return new ConvertJSON($this->fetchAll());
        } catch (Exception $e) {
            return false;
        }
    }

    public function maxId($column)
    {
        try {
            $this->querye("SELECT max({$column}) as maxid from {$this->table}");
            $this->execute();
            return $this->fetch();
        } catch (Exception $e) {
            return false;
        }
    }

    public function exist($where)
    {
        try {
            $this->querye("SELECT {$where[0]} FROM {$this->table} WHERE  {$where[0]}" . "= :" . "{$where[0]}");
            $this->bind(":" . $where[0], $where[1]);
            $this->execute();
            return ($this->rowCount() > 0) ? true : false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function save($fields, $data)
    {
        try {
            unset($fields[0]);
            unset($fields[1]);

            $fieldNames = implode(",", $fields);
            $fieldValues = ":" . implode(",:", $fields);
            $sql = "INSERT INTO {$this->table} ({$fieldNames}) VALUES ({$fieldValues})";
            if (count($fields) != count($data)) {
                exit("The number are not equals. parameters and values");
            }
            $datos = array_combine(explode(",", $fieldValues), $data);

            $this->querye($sql);
            foreach ($datos as $field => $value):
                $this->bind($field, $value);
            endforeach;
            $this->execute();

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($fields, $datos, $where)
    {
        try {
            $datos = array_combine($fields, $datos);
            $fieldDetail = "";

            foreach ($datos as $field => $value):
                $fieldDetail .= $field . "= :" . $field . ",";
            endforeach;
            $fieldDetail = substr($fieldDetail, 0, -1);
            $sql = "UPDATE {$this->table} SET {$fieldDetail} WHERE {$where[0]}" . "= :" . "{$where[0]}";

            $this->querye($sql);
            foreach ($datos as $field => $value):
                $this->bind(":" . $field, $value);
            endforeach;

            $this->bind(":" . $where[0], $where[1]);
            return $this->execute();

        } catch (Exception $e) {
            return false;
        }

    }
    public function deleteBy($id, $value, $limit = 1)
    {
        try {
            $this->querye("DELETE FROM {$this->table} WHERE {$id} = :idcolumn limit {$limit}");
            $this->bind(":idcolumn", $value);
            return $this->execute();
        } catch (Exception $e) {
            return false;
        }
    }

}

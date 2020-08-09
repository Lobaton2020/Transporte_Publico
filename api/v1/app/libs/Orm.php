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

    public function getByLimit($column, $value, $limit = 5)
    {
        try {
            $this->querye("SELECT * FROM {$this->table} WHERE {$column} = :columnvalue limit {$limit}");
            $this->bind(":columnvalue", $value);
            $this->execute();
            return new ConvertJSON($this->fetchAll());
        } catch (Exception $e) {
            return false;
        }
    }
    /*
    @param $cond Array [column,value]
    @param $columns Array [column1,column2] 
    @param $string String [value] 
    @param $limit Int [limit] 
*/
    public function getByCondLikeLimit($cond, $columns, $string, $limit = 5)
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$cond[0]} = :columnvalue AND ( {$columns[0]}  LIKE CONCAT('%',:like1,'%') OR  {$columns[1]} LIKE CONCAT('%',:like2,'%'))  limit {$limit}";
        $this->querye($sql);
        $this->bind(":columnvalue", $cond[1]);
        $this->bind(":like1", $string);
        $this->bind(":like2", $string);
        $this->execute();
        return new ConvertJSON($this->fetchAll());
    }
    /*
    @param $columns Array [column1,column2] 
    @param $string String [value] 
    @param $limit Int [limit] 
*/
    public function getByLikeLimit($columns, $string, $limit = 5)
    {
        try {

            $like = "";
            $cont = 0;
            foreach ($columns as $column) :
                $like .= "{$column} LIKE CONCAT('%',:{$column},'%')";
                isset($columns[++$cont]) ? $like .= " OR " : "";
            endforeach;
            (!empty($like)) ? $like = "WHERE " . $like : "";
            $sql = "SELECT * FROM {$this->table} {$like}  limit {$limit}";
            $this->querye($sql);
            foreach ($columns as $column) :
                $this->bind(":{$column}", $string);
            endforeach;
            $this->execute();
            return new ConvertJSON($this->fetchAll());
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function getByCount($column, $value)
    {
        try {
            $this->querye("SELECT * FROM {$this->table} WHERE {$column} = :columnvalue");
            $this->bind(":columnvalue", $value);
            $this->execute();
            return $this->rowCount();
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
    public function existByTable($table, $where)
    {
        try {
            $this->querye("SELECT {$where[0]} FROM {$table} WHERE  {$where[0]}" . "= :" . "{$where[0]}");
            $this->bind(":" . $where[0], $where[1]);
            $this->execute();
            return ($this->rowCount() > 0) ? true : false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function existByCond($whereA, $whereB)
    {
        try {
            $this->querye("SELECT {$whereA[0]} FROM {$this->table} WHERE  {$whereA[0]} = :{$whereA[0]} AND {$whereB[0]} = :{$whereB[0]}");
            $this->bind(":" . $whereA[0], $whereA[1]);
            $this->bind(":" . $whereB[0], $whereB[1]);
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
            foreach ($datos as $field => $value) :
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

            foreach ($datos as $field => $value) :
                $fieldDetail .= $field . "= :" . $field . ",";
            endforeach;
            $fieldDetail = substr($fieldDetail, 0, -1);
            $sql = "UPDATE {$this->table} SET {$fieldDetail} WHERE {$where[0]}" . "= :" . "{$where[0]}";

            $this->querye($sql);
            foreach ($datos as $field => $value) :
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

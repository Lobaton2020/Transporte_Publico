<?php
// interfaces de controladores
interface Crud
{
    public function all(); //GET
    public function get($id); //GET
    public function save(); //POST
}

interface User
{
    // Metodos de uso en clase
    public function update($type, $id = null); //POST
    public function updateText($data);
    public function updatePassword($data);
    public function updateImage($data);
}

interface Auth
{
    public function see(); //GET
    public function login(); //POST
    public function logout(); //GET
}

interface Contract
{
    public function renew(); //POST
}

interface Bus
{
    public function update(); //POST
}
interface Route
{
    public function update(); //POST
}

interface RouteBus
{
    public function all(); //GET
    public function get($idbus, $idruta); //GET
    public function save(); //POST
}

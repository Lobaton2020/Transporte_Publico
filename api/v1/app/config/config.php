<?php
// constantes de la base de datos
define("DBHOST", "localhost");
define("DBNAME", "transpublic");
define("DBUSER", "root");
define("DBPASWORD", "monserrate1010");
define("DBDRIVER", "mysql");
define("DBCHARSET", "utf8");
// datos del servidor
define("PROTOCOL", "http");

define("URL_APP", dirname(dirname(__FILE__)));
define("URL_PROJECT", PROTOCOL . '://' . $_SERVER["HTTP_HOST"] . '/' . $_SERVER["REQUEST_URI"]);
//
//datos de la empresa o cliente

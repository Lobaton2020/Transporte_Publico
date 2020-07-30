<?php
require_once "helpers/json.php";
require_once "helpers/field_empty.php";
require_once "migration/Migration.php";
require_once "config/config.php";
require_once "interfaces/interfaces.php";

date_default_timezone_set("America/Lima");

spl_autoload_register(function ($basename) {
    require "libs/" . $basename . ".php";
});

<?php
header('Content-type: text/html; charset=utf-8');
setlocale (LC_TIME, 'fr_FR.utf8','fra');
ini_set('date.timezone', 'Europe/Paris');
session_start();

$dev = true;
if($_SERVER["SERVER_NAME"] == "cbrplx.io" || $_SERVER["SERVER_NAME"] == "www.cbrplx.io"){
	$dev = false;
}

require_once "vendor/autoload.php";
require_once "inc/php/pdo.php";
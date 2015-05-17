<?php
header('Content-type: text/html; charset=utf-8');
setlocale (LC_TIME, 'fr_FR.utf8','fra', 'fr_FR');
ini_set('date.timezone', 'Europe/Paris');
session_start();

$dev = true;
if($_SERVER["SERVER_NAME"] == "cbrplx.io" || $_SERVER["SERVER_NAME"] == "www.cbrplx.io"){
	$dev = false;
}

if($dev){
	ini_set('display_error', '1');
	error_reporting(-1);
}

$refresh = false;
if(isset($_GET["refresh"])) $refresh = true;

require_once "vendor/autoload.php";
require_once "inc/php/pdo.php";

$loader = new \Twig_Loader_Filesystem('inc/template', 'Template');
$twig = new \Twig_Environment($loader, array('debug' => true));

if (isset($_GET['PHPSESSID'])){
	$requesturi = preg_replace('/?PHPSESSID=[^&]+/',"",$_SERVER['REQUEST_URI']);
	$requesturi = preg_replace('/&PHPSESSID=[^&]+/',"",$requesturi);
	header("HTTP/1.1 301 Moved Permanently");
	header("Location: http://".$_SERVER['HTTP_HOST'].$requesturi);
	exit;
}
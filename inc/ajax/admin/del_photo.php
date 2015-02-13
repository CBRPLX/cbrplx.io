<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["chemin"])){
	array_map('unlink', glob($_POST["chemin"]));
	echo "del";
}else{
	echo "no_image";
}
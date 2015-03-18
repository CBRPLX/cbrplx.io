<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["id_article"]) && !empty($_POST["plateforme"]) && !empty($_POST["timestamp"])){
	$partage = new \classe\partage();
	echo $partage->add($_POST["plateforme"], $_POST["id_article"], $_POST["timestamp"]);
}else{
	echo false;
}
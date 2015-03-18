<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["id_article"]) && !empty($_POST["plateforme"])){
	$partage = new \classe\partage();
	echo $partage->add($_POST["plateforme"], $_POST["id_article"]);
}else{
	echo false;
}
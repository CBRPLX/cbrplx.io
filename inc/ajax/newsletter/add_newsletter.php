<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["nom"]) && !empty($_POST["email"])){
	$newsletter = new \classe\newsletter();

	if(filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)){
		echo $newsletter->add($_POST["nom"], $_POST["email"]);
	}else{
		echo false;
	}
}else{
	echo false;
}
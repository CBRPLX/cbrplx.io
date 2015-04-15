<?php
require "inc/php/config.php";

if(!empty($_GET["keywords"])){
	$pageController = new \controller\rechercheController();
	$contenu = $pageController->genererRecherche($_GET["keywords"]);
	echo $contenu;
}else{
	header("Location: /");
}
<?php
require "inc/php/config.php";

if(!empty($_GET["id_article"])){
	$pageController = new \controller\articleController();
	$contenu = $pageController->genererArticle($_GET["id_article"]);
	echo $contenu;
}else{
	header("Location: /404");
}
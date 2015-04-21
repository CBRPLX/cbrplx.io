<?php
require "inc/php/config.php";

if(!empty($_GET["id_user"])){
	$pageController = new \controller\userController();
	$contenu = $pageController->genererUserPage($_GET["id_user"]);
	echo $contenu;
}else{
	header("Location: /404");
}
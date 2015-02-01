<?php
require "inc/php/config.php";

$pageController = new \controller\adminController();
if(isset($_SESSION["user"]) && !empty($_SESSION["user"])){
	$contenu = $pageController->genererAdmin();
}else{
	$contenu = $pageController->genererAdminConnexion();
}
echo $contenu;
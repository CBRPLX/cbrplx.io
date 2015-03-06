<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["id_article"])){
	$pageController = new \controller\generalController();
	echo $pageController->genererIndex($_POST["id_article"]);
}else{
	echo 0;
}
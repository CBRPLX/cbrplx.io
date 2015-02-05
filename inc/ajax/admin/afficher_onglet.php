<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["onglet"])){
	
	$adminController = new \controller\adminController();
	$code = "ERROR";
	
	switch ($_POST["onglet"]) {
		case 'modify_article':
			if(!empty($_POST["id"]))
				$code = $adminController->genererOnglet($_POST["onglet"], $_POST["id"]);
			break;
		
		default:
			$code = $adminController->genererOnglet($_POST["onglet"]);
			break;
	}

	// $code = "ERROR";
	// $adminController = new \controller\adminController();
	// $code = $adminController->genererOnglet($_POST["onglet"]);
	echo $code;
}else{
	echo "false";
}
<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["login"]) && !empty($_POST["password"])){
	$login = htmlentities($_POST["login"]);
	$password = htmlentities($_POST["password"]);

	$u = new \classe\user();
	$connexion = $u->connexion($login, $password);

	if($connexion){
		$_SESSION["user"] = serialize($u);
		echo "true";
	}else{
		echo "error";
	}
}else{
	echo "empty";
}
<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["nom"]) && !empty($_POST["email"])){
	$newsletter = new \classe\newsletter();

	if(filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)){
		$pageController = new \controller\emailController();
		$contenu = $pageController->genererInscriptionNews($_POST["nom"]);
		
		$destinataire = ucfirst(strtolower($_POST["nom"]))." <".$_POST["email"].">";
		$pageController->envoyerEmail($destinataire, "Inscription à la newsletter cbrplx.io", $contenu);

		echo $newsletter->add($_POST["nom"], $_POST["email"]);
	}else{
		echo false;
	}
}else{
	echo false;
}
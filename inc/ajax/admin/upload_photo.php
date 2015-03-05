<?php chdir("../../../");
require "inc/php/config.php";

$retour = new stdClass();
$retour->img = false;
if(!empty($_POST["id_article"])){
	$id_article = $_POST["id_article"];

	$uploaddir = 'assets/'.$id_article;

	//Si le dossier n'existe pas
	if (!file_exists($uploaddir)) {
	    mkdir($uploaddir);
	}

	//Si c'est la photo de couv, on suppr l'ancienne
	if($_POST["couverture"] == "1")
		array_map('unlink', glob($uploaddir."/".$id_article.".*"));

	$files = glob($uploaddir . '/'.$id_article.'-*.*');
	if ($files !== false){
	    $nb_img = count($files);
	}else{
	    $nb_img = 0;
	}

	foreach($_FILES as $file){
		$file_name = pathinfo($file['name']);
		if(strtolower($file_name["extension"]) == "png" 
			|| strtolower($file_name["extension"]) == "jpg" 
			|| strtolower($file_name["extension"]) == "jpeg"
			|| strtolower($file_name["extension"]) == "gif"){

			if($_POST["couverture"] == "1"){
				if(move_uploaded_file($file['tmp_name'], $uploaddir ."/".$id_article.".".strtolower($file_name['extension']))){
					$retour->img = $uploaddir ."/".$id_article.".".strtolower($file_name['extension']);
					$retour->new_row = "";
				}
			}else{
				if(move_uploaded_file($file['tmp_name'], $uploaddir ."/".$id_article."-".$nb_img.".".strtolower($file_name['extension']))){
					$retour->img = $uploaddir ."/".$id_article."-".$nb_img.".".strtolower($file_name['extension']);
					$retour->new_row = file_get_contents("inc/template/image_row.html");
					$retour->nb_img = $nb_img;
				}
			}
		}
	}
}

echo json_encode($retour);
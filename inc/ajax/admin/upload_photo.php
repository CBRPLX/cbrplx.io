<?php chdir("../../../");
require "/inc/php/config.php";

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

	$files = glob($uploaddir . '/'.$id_article.'_*.*');
	if ($files !== false){
	    $nb_img = count($files);
	}else{
	    $nb_img = 0;
	}

	foreach($_FILES as $file){
		if(strtolower(pathinfo($file['name'])['extension']) == "png" 
			|| strtolower(pathinfo($file['name'])['extension']) == "jpg" 
			|| strtolower(pathinfo($file['name'])['extension']) == "jpeg"
			|| strtolower(pathinfo($file['name'])['extension']) == "gif"){

			if($_POST["couverture"] == "1"){
				if(move_uploaded_file($file['tmp_name'], $uploaddir ."/".$id_article.".".strtolower(pathinfo($file['name'])['extension']))){
					$retour->img = $uploaddir ."/".$id_article.".".strtolower(pathinfo($file['name'])['extension']);
					$retour->new_row = "";
				}
			}else{
				if(move_uploaded_file($file['tmp_name'], $uploaddir ."/".$id_article."_".$nb_img.".".strtolower(pathinfo($file['name'])['extension']))){
					$retour->img = $uploaddir ."/".$id_article."_".$nb_img.".".strtolower(pathinfo($file['name'])['extension']);
					$retour->new_row = file_get_contents("inc/template/image_row.html");
					$retour->nb_img = $nb_img;
				}
			}
		}
	}
}

echo json_encode($retour);
<?php chdir("../../../");
require "/inc/php/config.php";

$retour = false;
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

	$files = glob($uploaddir . '/*');
	if ($files !== false){
	    $nb_img = count($files);
	}else{
	    $nb_img = 0;
	}

	foreach($_FILES as $file){
		if(strtolower(pathinfo($file['name'])['extension']) == "png" 
			|| strtolower(pathinfo($file['name'])['extension']) == "jpg" 
			|| strtolower(pathinfo($file['name'])['extension']) == "jpeg"){

			if($_POST["couverture"] == "1"){
				if(move_uploaded_file($file['tmp_name'], $uploaddir ."/".$id_article.".".strtolower(pathinfo($file['name'])['extension']))){
					$retour = $uploaddir ."/".$id_article.".".strtolower(pathinfo($file['name'])['extension']);
				}
			}else{
				if(move_uploaded_file($file['tmp_name'], $uploaddir ."/".$id_article."_".$nb_img.".".strtolower(pathinfo($file['name'])['extension']))){
					$retour = $uploaddir ."/".$id_article.".".strtolower(pathinfo($file['name'])['extension']);
				}
			}
		}
	}
}

// echo $uploaddir ."/".$id_article.".".strtolower(pathinfo($file['name'])['extension']);

echo $retour;

// echo $nb_img;

// $error = false;
// $files = array();


// $uploaddir = '/assets/'.$u->id_utilisateur;

// if (!file_exists($uploaddir)) {
//     mkdir($uploaddir);
// }
// array_map('unlink', glob($uploaddir."/photo_profil.*"));

// foreach($_FILES as $file)
// {
// 	if(strtolower(pathinfo($file['name'])['extension']) == "png" || strtolower(pathinfo($file['name'])['extension']) == "jpg" 
// 		|| strtolower(pathinfo($file['name'])['extension']) == "jpeg"){

// 		if(move_uploaded_file($file['tmp_name'], $uploaddir ."/photo_profil.".strtolower(pathinfo($file['name'])['extension'])))
// 		{
// 			$chemin = $uploaddir ."/photo_profil.".strtolower(pathinfo($file['name'])['extension'])."=300x300xcarre?".time();
			
// 			if($dev){
// 				$files[] = str_replace("../nomade/", "http://terrenomade.univ.tf/", $chemin);
// 			}else{
// 				$files[] = str_replace("/home/www/nomade/", "http://www.neo-nomade.com/", $chemin);
// 			}
// 		}
// 		else
// 		{
// 			$error = true;
// 		}
		
// 	}else{
// 		$error = true;
// 	}
// }
// $data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
// echo json_encode($data);
<?php
require "inc/php/config.php";
ini_set('display_errors', '1');
// $pageController = new \controller\emailController();
// echo $pageController->genererInscriptionNews("Robin Pierrot");

global $pdo;

$sql = "SELECT id_article FROM cbrplx_io_article";
$stm = $pdo->prepare($sql);
$stm->execute();

while ($res = $stm->fetch(\PDO::FETCH_OBJ)) {

	$article = new \classe\article();
	$article->load($res->id_article);

	echo $article->getNbViews()." <br/>";

	// for($i = 0; $i < $article->nb_vue; $i++){

	// 	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
	// 	    $ip = $_SERVER['HTTP_CLIENT_IP'];
	// 	} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
	// 	    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	// 	} else {
	// 	    $ip = $_SERVER['REMOTE_ADDR'];
	// 	}

	// 	$sql = "INSERT INTO cbrplx_io_article_view (id_article, timestamp, ip) 
	// 			VALUES (?,?,?)";
	// 	$stmt = $pdo->prepare($sql);
	// 	$stmt->execute(array($res->id_article, time(), $ip));
	// 	echo "$i : ".$stmt->rowCount()." <br/>";
	// }
}
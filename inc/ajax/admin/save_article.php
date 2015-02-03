<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["id_article"]) && !empty($_POST["query"])){
	$article = new \classe\article();
	$article->load($_POST["id_article"]);

	// var_dump($_POST["query"]);
	$params = urldecode($_POST["query"]);
	// var_dump($params);
	$params = (array) json_decode($params);
	// var_dump($params);
	// var_dump($article->save($_POST["id_article"], (array) $params));
	if($article->save($_POST["id_article"], (array) $params)){
		echo "deal";
	}else{
		echo "error";
	}
}else{
	echo "error";
}
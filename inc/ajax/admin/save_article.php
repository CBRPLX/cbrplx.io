<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["id_article"]) && !empty($_POST["query"])){
	$article = new \classe\article();
	$article->load($_POST["id_article"]);

	// if(!$dev)
	// 	$_POST["query"] = stripslashes($_POST["query"]);
	$params = $_POST["query"];
	// $params = urldecode($params);
	$params = (array) json_decode($params);
	
	if($article->save($_POST["id_article"], (array) $params)){
		echo "deal";
	}else{
		echo "error";
	}
}else{
	echo "error";
}
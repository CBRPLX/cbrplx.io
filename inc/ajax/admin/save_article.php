<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["id_article"]) && !empty($_POST["query"])){
	$article = new \classe\article();
	$article->load($_POST["id_article"]);

	// $_POST["query"] = preg_replace("/\\n/", "\\\n", $_POST["query"]);
	// $_POST["query"] = nl2br($_POST["query"]);
	// var_dump($_POST["query"]);
	if(!$dev)
		$_POST["query"] = stripslashes($_POST["query"]);
	$params = urldecode($_POST["query"]);
	$params = (array) json_decode($params);
	
	if($article->save($_POST["id_article"], (array) $params)){
		echo "deal";
	}else{
		echo "error";
	}
}else{
	echo "error";
}
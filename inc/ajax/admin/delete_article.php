<?php chdir("../../../");
require "inc/php/config.php";

if(!empty($_POST["id"])){

	$article = new \classe\article();
	$article->set("id_article", $_POST["id"]);
	if($article->del() == true){
		echo "deal";
	}else{
		echo "false";
	}
}else{
	echo "false";
}
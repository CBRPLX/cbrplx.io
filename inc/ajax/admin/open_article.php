<?php chdir("../../../");
require "inc/php/config.php";

$article = new \classe\article();
echo $article->add();
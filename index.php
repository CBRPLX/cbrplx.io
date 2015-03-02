<?php
require "inc/php/config.php";

$pageController = new \controller\generalController();

$article = new \classe\Article();
$article->load("7");

$techno = new \classe\Techno();
$techno = $techno->delFromArticle("7");


echo $pageController->genererSquelette("coucou");
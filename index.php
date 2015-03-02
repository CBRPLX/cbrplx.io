<?php
require "inc/php/config.php";

$pageController = new \controller\generalController();

$article = new \classe\Article();
$article->load("7");

// $techno = new \classe\Techno();
// $techno = $techno->load();


echo $pageController->genererSquelette("coucou");
<?php
require "inc/php/config.php";

$pageController = new \controller\generalController();
$contenu = $pageController->generer404();
echo $contenu;
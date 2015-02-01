<?php
require "inc/php/config.php";

$pageController = new \controller\generalController();
$contenu = $pageController->genererAPropos();
echo $pageController->genererSquelette($contenu);
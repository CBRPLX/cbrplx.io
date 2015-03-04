<?php
require "inc/php/config.php";

$pageController = new \controller\generalController();
$contenu = $pageController->generer403();
echo $contenu;
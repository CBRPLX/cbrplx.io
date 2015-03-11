<?php
require "inc/php/config.php";

$pageController = new \controller\emailController();
echo $pageController->genererInscriptionNews("Robin Pierrot");
<?php
require "inc/php/config.php";

$pageController = new \controller\generalController();
echo $pageController->genererSquelette("COUCOU");
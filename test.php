<?php
require "inc/php/config.php";
ini_set('display_errors', '1');

$social = new \classe\social();
$coucou = $social->loadFromUser(1);
// var_dump($coucou);
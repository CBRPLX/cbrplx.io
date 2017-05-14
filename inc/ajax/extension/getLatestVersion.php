<?php chdir("../../../");
require "inc/php/config.php";

if (! empty($_POST['extensionName'])) {
	echo \classe\extension::getInfoLatestVersionJSON($_POST['extensionName']);
} else {
	echo json_encode(array());
}
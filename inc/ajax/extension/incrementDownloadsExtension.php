<?php chdir("../../../");
require "inc/php/config.php";

if (!empty($_POST['extensionName'])) {
	\classe\extension::incrementDownloadLatestVersion($_POST['extensionName']);
}
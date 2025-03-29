<?php

require_once 'databaseSQlite.php';

session_start();

$dbLite = new DataBaseSQlite();
$dbLite->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$dbLite->validerPanier($_SESSION['id']);
	echo 1;
}

?>


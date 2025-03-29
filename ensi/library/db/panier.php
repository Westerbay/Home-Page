<?php

require_once 'databaseSQlite.php';

session_start();

$dbLite = new DataBaseSQlite();
$dbLite->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $article = $_POST['article'];
    $titre = $_POST['titre'];
    $editeur = $_POST['editeur'];
    $prix = $_POST['prix'];
    if (isset($_SESSION['id'])) {
    	$dbLite->addToPanier($_SESSION['id'], $article, $titre, $editeur, $prix);
    	echo 1;
    }
    else {
    	echo 0;
    }    
}

?>


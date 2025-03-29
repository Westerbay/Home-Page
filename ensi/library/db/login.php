<?php

require_once 'databaseSQlite.php';

session_start();

$dbLite = new DataBaseSQlite();
$dbLite->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nom = htmlspecialchars($_POST['nom']);
    $prenom = htmlspecialchars($_POST['prenom']);
    
    $code = $dbLite->getClientId($nom, $prenom);
    if ($code != 0) {
    	$_SESSION["id"] = $code;
    	$_SESSION["nom"] = $nom;
    	$_SESSION["prenom"] = $prenom;
    }
    echo $code;
}

?>


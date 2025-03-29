<?php

require_once 'databaseSQlite.php';

session_start();

$dbLite = new DataBaseSQlite();
$dbLite->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nom = htmlspecialchars($_POST['nom']);
    $prenom = htmlspecialchars($_POST['prenom']);
    $adresse = htmlspecialchars($_POST['adresse']);
    $code = htmlspecialchars($_POST['code']);
    $ville = htmlspecialchars($_POST['ville']);
    $pays = htmlspecialchars($_POST['pays']);
    
    $code = $dbLite->checkAndInsertClient($nom, $prenom, $adresse, $code, $ville, $pays);
    if ($code != 0) {
    	$_SESSION["id"] = $code;
    	$_SESSION["nom"] = $nom;
    	$_SESSION["prenom"] = $prenom;
    }
    echo $code;
}

?>


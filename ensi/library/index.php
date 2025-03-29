<?php
require_once 'db/databaseSQlite.php';
require_once 'db/databasePostgres.php';

session_start();

$visitFilename = 'visit.txt'; 
function handleVisitCounter($visitFilename) {
    if (isset($_COOKIE['present'])) {    	
        $nbVisit = intval(file_get_contents($visitFilename)); 
    } else {        
        $content = file_get_contents($visitFilename);
        $nbVisit = intval($content) + 1; 
        file_put_contents($visitFilename, $nbVisit);
        setcookie('present', 'present', time() + 3600); 
    }
    return $nbVisit;
}

$banner = '<p id="buttonRegister">Inscription</p><p>|</p><p id="buttonConnect">Connexion</p>';
if (isset($_SESSION['id'])) {
	$banner = '<p>'.'Bienvenue '.$_SESSION['prenom'].' '.$_SESSION['nom'].'<a href="index.php?panier=true" id="panierButton">🛒</a></p>';
}

$nbVisit = handleVisitCounter($visitFilename);
$fragment = "";
$panierItems = "";
if (isset($_GET["panier"]) && $_GET["panier"] == "true" && isset($_SESSION['id'])) {
	$dbLite = new DataBaseSQlite();
	$dbLite->connectPath('db/database.db');
	
	$panierItems = $dbLite->createPanierView($_SESSION['id']);
	$fragment = 'panierFragment.phtml';
}
else {
	$fragment = 'htmlFragment.phtml';
}

include $fragment;
?>


<?php

require_once 'databasePostgres.php';

session_start();

$db = new DataBasePostgres();
$db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['id'] == null or $_POST['value'] == null) {
        exit;
    }
    $id = $_POST['id'];
    $value = $_POST['value'];
    $authorRequest = $_POST['author'] ?? -1;
    switch ($id) {
    	case "author":
    		echo $db->requestAuthor($value);    
    		break;
    	case "title":
    		echo $db->requestTitle($value, $authorRequest);    
    		break;
    }
    exit;
}

?>

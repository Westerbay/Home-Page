<?php

class DataBaseSQlite {

    private $db;

    public function connect() {
        $this->db = new SQLite3('database.db');
        $this->init();
    }
    
    public function connectPath($path) {
        $this->db = new SQLite3($path);
        $this->init();
    }

    public function execute(string $request) {
        $this->db->exec($request);
    }

    public function checkAndInsertClient($nom, $prenom, $adresse, $code_postal, $ville, $pays) {
        $query = "SELECT code_client FROM client WHERE nom = :nom AND prenom = :prenom AND adresse = :adresse";        
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':nom', $nom, SQLITE3_TEXT);
        $stmt->bindValue(':prenom', $prenom, SQLITE3_TEXT);
        $stmt->bindValue(':adresse', $adresse, SQLITE3_TEXT);
        
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);

        if ($row) {
            return 0;
        }

        $insertQuery = "INSERT INTO client (nom, prenom, adresse, code_postal, ville, pays, date_inscription) VALUES (:nom, :prenom, :adresse, :code_postal, :ville, :pays, :date_inscription)";
    
		$insertStmt = $this->db->prepare($insertQuery);
		$insertStmt->bindValue(':nom', $nom, SQLITE3_TEXT);
		$insertStmt->bindValue(':prenom', $prenom, SQLITE3_TEXT);
		$insertStmt->bindValue(':adresse', $adresse, SQLITE3_TEXT);
		$insertStmt->bindValue(':code_postal', $code_postal, SQLITE3_TEXT);
		$insertStmt->bindValue(':ville', $ville, SQLITE3_TEXT);
		$insertStmt->bindValue(':pays', $pays, SQLITE3_TEXT);
		
		$currentDate = date('Y-m-d H:i:s');
		$insertStmt->bindValue(':date_inscription', $currentDate, SQLITE3_TEXT);

		$insertStmt->execute();

		$lastInsertId = $this->db->lastInsertRowID();

		return $lastInsertId;
    }
    
    public function getClientId($nom, $prenom) {
		$query = "SELECT code_client FROM client WHERE nom = :nom AND prenom = :prenom";
		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':nom', $nom, SQLITE3_TEXT);
		$stmt->bindValue(':prenom', $prenom, SQLITE3_TEXT);
		
		$result = $stmt->execute();
		$row = $result->fetchArray(SQLITE3_ASSOC);
		
		if ($row) {
		    return $row['code_client'];
		}
		
		return 0;
	}
	
	public function viderPanier($code_client) {
		$query = "DELETE FROM panier WHERE code_client = :code_client";
		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':code_client', $code_client, SQLITE3_INTEGER);
		$stmt->execute();
	}
	
	public function validerPanier($code_client) {
		$query = "SELECT * FROM panier WHERE code_client = :code_client";
		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':code_client', $code_client, SQLITE3_INTEGER);
		$result = $stmt->execute();

		while ($item = $result->fetchArray(SQLITE3_ASSOC)) {
		    $insertQuery = "INSERT INTO commande (code_client, code_exemplaire, quantite, prix, date_commande, titre, editeur) 
		                    VALUES (:code_client, :code_exemplaire, :quantite, :prix, CURRENT_TIMESTAMP, :titre, :editeur)";
		    $insertStmt = $this->db->prepare($insertQuery);
		    $insertStmt->bindValue(':code_client', $code_client, SQLITE3_INTEGER);
		    $insertStmt->bindValue(':code_exemplaire', $item['code_exemplaire'], SQLITE3_INTEGER);
		    $insertStmt->bindValue(':quantite', $item['quantite'], SQLITE3_INTEGER);
		    $insertStmt->bindValue(':prix', $item['prix'], SQLITE3_FLOAT);
		    $insertStmt->bindValue(':titre', $item['titre'], SQLITE3_TEXT);
		    $insertStmt->bindValue(':editeur', $item['editeur'], SQLITE3_TEXT);
		    $insertStmt->execute();
		}

		$query = "DELETE FROM panier WHERE code_client = :code_client";
		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':code_client', $code_client, SQLITE3_INTEGER);
		$stmt->execute();
	}


    private function init() {
        $this->execute($this->requestClientTable());
        $this->execute($this->requestPanierTable());
        $this->execute($this->requestCommandeTable());
    }

    private function requestClientTable() {
        $sql = "
        CREATE TABLE IF NOT EXISTS client (
            code_client INTEGER PRIMARY KEY AUTOINCREMENT,
            nom VARCHAR(100) NOT NULL,
            prenom VARCHAR(100) NOT NULL,
            adresse VARCHAR(255) NOT NULL,
            code_postal VARCHAR(20) NOT NULL,
            ville VARCHAR(100) NOT NULL,
            pays VARCHAR(100) NOT NULL,
            date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
        );";
        return $sql;
    }

    private function requestPanierTable() {
        $sql = "
        CREATE TABLE IF NOT EXISTS panier (
            code_client INT,
            code_exemplaire INT,
            quantite INT NOT NULL,
            titre VARCHAR(100),
            editeur VARCHAR(100),
            prix DECIMAL(10, 2)
        );
        ";
        return $sql;
    }

    private function requestCommandeTable() {
        $sql = "
        CREATE TABLE IF NOT EXISTS commande (
            code_client INT,
            code_exemplaire INT,
            quantite INT NOT NULL,
            prix DECIMAL(10, 2) NOT NULL,
            date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
            titre VARCHAR(100),
            editeur VARCHAR(100)
        );
        ";
        return $sql;
    }
    
    public function addToPanier($code_client, $code_exemplaire, $titre, $editeur, $prix) {
		$query = "SELECT quantite FROM panier WHERE code_client = :code_client AND code_exemplaire = :code_exemplaire";
		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':code_client', $code_client, SQLITE3_INTEGER);
		$stmt->bindValue(':code_exemplaire', $code_exemplaire, SQLITE3_INTEGER);
		
		$result = $stmt->execute();
		$row = $result->fetchArray(SQLITE3_ASSOC);

		if ($row) {
		    $updateQuery = "UPDATE panier SET quantite = quantite + 1 WHERE code_client = :code_client AND code_exemplaire = :code_exemplaire";
		    $updateStmt = $this->db->prepare($updateQuery);
		    $updateStmt->bindValue(':code_client', $code_client, SQLITE3_INTEGER);
		    $updateStmt->bindValue(':code_exemplaire', $code_exemplaire, SQLITE3_INTEGER);
		    $updateStmt->execute();
		} else {
		    $insertQuery = "INSERT INTO panier (code_client, code_exemplaire, quantite, titre, editeur, prix) VALUES (:code_client, :code_exemplaire, 1, :titre, :editeur, :prix)";
		    $insertStmt = $this->db->prepare($insertQuery);
		    $insertStmt->bindValue(':code_client', $code_client, SQLITE3_INTEGER);
		    $insertStmt->bindValue(':code_exemplaire', $code_exemplaire, SQLITE3_INTEGER);
		    $insertStmt->bindValue(':titre', $titre, SQLITE3_TEXT);
		    $insertStmt->bindValue(':editeur', $editeur, SQLITE3_TEXT);
		    $insertStmt->bindValue(':prix', $prix, SQLITE3_FLOAT);
		    $insertStmt->execute();
		}
	}
    
    public function createPanierView($code_client) {
		$query = "SELECT * FROM panier WHERE code_client = :code_client ORDER BY titre ASC";
		$stmt = $this->db->prepare($query);
		$stmt->bindValue(':code_client', $code_client, SQLITE3_INTEGER);
		$result = $stmt->execute();

		$content = "<ul id='panierContent'>";
		$last = 0;
		$total = 0;

		while ($item = $result->fetchArray(SQLITE3_ASSOC)) {
		    $titre = preg_replace(['/l /', '/L /', '/D /', '/d /'], ["l'", "L'", "D'", "d'"], $item['titre']);
		    $editeur = preg_replace(['/l /', '/L /', '/D /', '/d /'], ["l'", "L'", "D'", "d'"], $item['editeur']);
		    $prixTotal = number_format($item['quantite'] * $item['prix'], 2);
		    
		    $total += $prixTotal;

		    if ($last == $item['code_exemplaire']) {
		        $content .= "<li>Éditeur : {$editeur}, Quantité : {$item['quantite']}, Prix unitaire : {$item['prix']}€, Total : {$prixTotal}€</li>";
		    } else {
		        if ($last != 0) {
		            $content .= "</ul></li>";
		        }
		        $content .= "<li><strong>{$titre}</strong> <ul><li>Éditeur : {$editeur}, Quantité : {$item['quantite']}, Prix unitaire : {$item['prix']}€, Total : {$prixTotal}€</li>";
		    }
		    $last = $item['code_exemplaire'];
		}

		if ($last != 0) {
		    $content .= "</ul></li>";
		}
		$content .= "</ul>";
		
		if ($total != 0) {
			$content .= "<h2 id='totalPrice'> Prix total : ".$total."€</h2>";
		}

		return $content;
    }
	
}

?>


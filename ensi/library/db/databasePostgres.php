<?php

class DataBasePostgres {
 
	private $sqlAuthor = "SELECT * FROM auteurs WHERE LOWER(nom) LIKE :name OR LOWER(prenom) LIKE :name ORDER BY nom ASC, prenom ASC";
	// If the price is not define for a book, then it will be 1€
	private $sqlTitle = "SELECT O.code AS code, COALESCE(prix, 1) as prix, K.nom as editeur, O.nom as livre FROM ouvrage O JOIN exemplaire E ON E.code_ouvrage = O.code JOIN editeurs K ON E.code_editeur = K.code JOIN ecrit_par P on P.code_ouvrage = O.code JOIN auteurs A ON A.code = P.code_auteur WHERE (LOWER(O.nom) LIKE :title AND -1 = :author) OR A.code = :author ORDER BY O.nom ASC, K.nom ASC, prix ASC";
	private $pdo;
	
	
	public function connect() {
        $this->pdo = new SQLite3('livres.db');
    }

    public function requestAuthor($name) {		
        $stmt = $this->pdo->prepare($this->sqlAuthor);
        $stmt->bindValue(':name', '%' . strtolower($name) . '%', SQLITE3_TEXT);
        return $this->executeRequest($stmt);
    }

    public function requestTitle($title, $author) {		
        $stmt = $this->pdo->prepare($this->sqlTitle);
        $stmt->bindValue(':author', $author, SQLITE3_INTEGER);
        $stmt->bindValue(':title', '%' . strtolower($title) . '%', SQLITE3_TEXT);
        return $this->executeRequest($stmt);
    }

    private function executeRequest($stmt) {
        try {
            $result = $stmt->execute();
            $rows = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $rows[] = $row;
            }
            return json_encode($rows);
        } catch (Exception $e) {
            echo "Erreur : " . $e->getMessage();
        }
    }

}

?>


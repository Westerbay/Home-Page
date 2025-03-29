function main() {
	const data = {};
	$("#commander").click(function() {
		if (!confirm("Voulez-vous vraiment valider le panier ?")) {
			return;
		}
		$.ajax({
		  url: './db/validerPanier.php',  
		  type: 'POST',
		  data: data,
		  success: function(code) {
		  	$("#panierContent").empty();
		  	$("#totalPrice").empty();
		  	alert("Merci d'avoir passé commande !");
		  },
		  error: function() {
			console.error("Erreur lors de la validation panier.");
		  }
		});
	});
	
	$("#clear").click(function() {		
		$.ajax({
		  url: './db/viderPanier.php',  
		  type: 'POST',
		  data: data,
		  success: function(code) {
		  	$("#panierContent").empty();
		  	$("#totalPrice").empty();
		  	alert("Le panier a été vidé");
		  },
		  error: function() {
			console.error("Erreur lors du vidage panier.");
		  }
		});
	});
}

$(document).ready(main);

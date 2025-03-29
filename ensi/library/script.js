// getElementById -> $("#id")
// innerHTML -> .html

livres = [];
editeurs = [];
prices = [];

function main() {
	$("#register").hide();
	$("#login").hide();
	$("#shadow").hide();
	$("#author").keyup(function () {
		asynchronousRequest($(this).attr("id"), $(this).val(), -1);
	});
	$("#title").keyup(function () {
		asynchronousRequest($(this).attr("id"), $(this).val(), -1);
	});
	$("#annuler").click(function() {
		$("#register")[0].reset();
		$("#register").hide();
		$("#shadow").hide();
	});
	$("#annulerConnexion").click(function() {
		$("#login")[0].reset();
		$("#login").hide();
		$("#shadow").hide();
	});
	$("#register").submit(function(event) {
		event.preventDefault();
		var formData = $(this).serialize();
		$.ajax({
		  url: './db/register.php',  
		  type: 'POST',
		  data: formData,
		  success: function(code) {
			if (code == 0) {
				$("#error").html("Ce client existe déjà !");
			}
			else {
				$("#banner").html(`<p>Bienvenue ${$("#prenom").val()} ${$("#nom").val()}<a href="index.php?panier=true" id="panierButton">🛒</a></p>`);
				$("#register")[0].reset();
				$("#register").hide();
				$("#shadow").hide();				
			}
		  },
		  error: function() {
			console.error("Erreur lors de l'envoi des données forumlaires.");
		  }
		});
	});
	$("#buttonRegister").click(function() {
		$("#register").show();
		$("#shadow").show();
	});
	$("#buttonConnect").click(function() {
		$("#login").show();
		$("#shadow").show();
	});
	$("#login").submit(function(event) {
		event.preventDefault();
		var formData = $(this).serialize();
		$.ajax({
		  url: './db/login.php',  
		  type: 'POST',
		  data: formData,
		  success: function(code) {
			if (code == 0) {

				$("#errorLog").html("Ce client n'existe pas !");
			}
			else {
				$("#banner").html(`<p>Bienvenue ${$("#prenomLog").val()} ${$("#nomLog").val()}<a href="index.php?panier=true" id="panierButton">🛒</a></p>`);
				$("#login")[0].reset();
				$("#login").hide();
				$("#shadow").hide();				
			}
		  },
		  error: function() {
			console.error("Erreur lors de l'envoi des données forumlaires.");
		  }
		});
	});
}


/**
 * Data Parsing authors
 */
function createListAuteurs(obj) {
	var content = "<ul>";
	obj.forEach(function(item) {		
		requestAuthorClick = `'asynchronousRequest("title", "-1", ${item.code})'`;
		content += `<li><a href="#" onClick=${requestAuthorClick}><strong>${item.prenom} ${item.nom}</strong></a></li>`;
	});
	content += "</ul>";
	return content;
}

function add(item) {
	const data = {
		article: item, 
		titre: livres[item],
		editeur: editeurs[item],
		prix: prices[item]
	};	
	$.ajax({
		url: './db/panier.php',  
        type: 'POST',            
        data: data, 
        success: function (response) {
        	if (response == 0) {
        		$("#login").show();
				$("#shadow").show();
        	}
        	else {
        		alert(`${livres[item]} (${editeurs[item]}) a été ajouté au panier !`);
        	}
        },
        error: function () {
        	console.log("Erreur lors de l'ajout dans panier");
        }
	});
}

/**
 * Data Parsing Title
 */
function createListTitres(obj) {
	var content = "<ul>";
	var last = 0;
	obj.forEach(function(item) {
		var livre = item.livre.replace(/l /g, "l'");
		livre = livre.replace(/L /g, "L'");
		livre = livre.replace(/D /g, "D'");
		livre = livre.replace(/d /g, "d'");
		
		var editeur = item.editeur.replace(/l /g, "l'");
		editeur = editeur.replace(/L /g, "L'");
		editeur = editeur.replace(/D /g, "D'");
		editeur = editeur.replace(/d /g, "d'");
		
		livres[item.code] = livre;
		editeurs[item.code] = editeur;
		prices[item.code] = item.prix;
		if (last == item.code) {
			content += `<li>Editeur : ${editeur}, Prix : ${item.prix}€<a class='article' onClick=add(${item.code})>➕🛒</a></ul></li>`;
		}
		else {
			if (last != 0) {
				content += "</ul></li>";
			}
			content += `<li><strong>${livre}</strong> <ul><li>Editeur : ${editeur}, Prix : ${item.prix}€<a class='article' onClick=add(${item.code})>➕🛒</a></li>`;
		}
		last = item.code;
	});
	if (last != 0) {
		content += "</ul></li>";
	}
	content += "</ul>";
	return content;
}

/**
 * Server Response
 */
function serverResponse(id, value) {
	var content = "";
	switch (id) {
		case "author":
			try {
				content = createListAuteurs(JSON.parse(value));
			} catch (error) {}	
			$("#authorContent").html(content);
			break;
		case "title":
			try {
				content = createListTitres(JSON.parse(value));
			} catch (error) {}	
			$("#titleContent").html(content);
			break;
	}
}

/**
 * AJAX Request
 */
function asynchronousRequest(id, value, specialAuthorRequest) {
	const data = {
		id: id, 
		value: value.toLowerCase(),
		author: specialAuthorRequest
	};	
	$.ajax({
		url: './db/search.php',  
        type: 'POST',            
        data: data, 
        success: function (response) {
        	serverResponse(id, response);
        },
        error: function () {
        	console.error("Erreur lors de l'envoi des données recherches.");
        }
	});
}

$(document).ready(main);

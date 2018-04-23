// JS for index.handlebars

'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("Currently on In-Game Page.");

	$("#TipText").hide();

	$("#GetATip").click(function(e) {
		console.log("Retrieving a tip...");
		e.preventDefault();

		$.get("/getatip", function(tip) {
			$("#TipText").show();
			$("#TipText").text(tip);
		});
	});
});
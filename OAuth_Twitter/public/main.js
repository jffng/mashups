console.log("Loaded!");

$(document).ready(function(){
	$('#twitterAuth').click(function(){
		document.location.href = '/auth/twitter';
	});
});
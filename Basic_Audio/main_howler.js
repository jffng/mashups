var freeData, sound;

function getFreeSound(term){

	var url = 'http://www.freesound.org/api/sounds/search/?q=';
	var myKey = '&api_key=' + YOUR APIKEY;
	var myURL = url + term + myKey;

	$.ajax({
		url: myURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(data){
			console.log("We got problems");
			console.log(data.status);
		},
		success: function(data){
			console.log("WooHoo!");
			console.log(data);
			freeData = data;
			var audioLink = freeData.sounds[0]['preview-hq-mp3'];
			console.log(audioLink);

			//HowlerJS
			sound = new Howl({
				urls: [audioLink]
			});
		}
	});
}

$(document).ready(function(){
	$('#play').click(function(){
		//Howler
		sound.play();
	});
	$('#pause').click(function(){
		//Howler
		sound.pause();
	});
});

$(document).keydown(function(e) {
	console.log(e);
	console.log(e.keyCode);
	var curKey = e.keyCode;

	switch(curKey){
		//Up
		case 38:
			//Howler
			sound.pause();
			sound._rate += 0.1;
			sound.play();
			break;
		//Down
		case 40:
			//Howler
			sound.pause();
			sound._rate -= 0.1;
			sound.play();
			break;
	}
});

getFreeSound('lazer');
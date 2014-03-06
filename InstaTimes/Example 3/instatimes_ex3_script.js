/*
NYU - ITP - MASHUPS CLASS
SPRING 2014
gihtub.com/craigprotzel/Mashups
 
INSTATIMES - A NY Times + Instagram Mashup
NY Times API Reference - http://developer.nytimes.com/page
Instagram API Reference - http://instagram.com/developer/
Developer Keys for BOTH APIs are necessary to execute the final script

Example 3:
- Add in Instagram API request functionality
- Use global array to loop through existing objects and add data to them
*/

//Create a constructor function for the main object
//Constructor functions are best distinguished by capitalizing the function name
//Add a second argument to the constructor for the article snippet
//Set the img property to an empty string
function InstaTimesArticle(curHeadline, curSnippet){
	"use strict";

	this.title = curHeadline;
	this.text = curSnippet;
	this.img = "";
}

//Create a global array to hold all the InstaTimesArticle objects
var instaTimes = [];

//Define the function to execute the NY Times AJAX call
function getNYTimesData() {
	"use strict";
	var nyTimesSearchURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=new+york+times&page=1&sort=newest&api-key=';
	var myNYKey = 'YOUR-DEVELOPER-KEY-GOES-HERE';

	$.ajax({
		url: nyTimesSearchURL + myNYKey,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log("We got problems");
			console.log(data.status);
		},
		success: function(data){
			console.log("WooHoo!");
			//console.log(data);

			var nyTimesArticles;
			//Check to make sure the data is correct
			if (!(data.response.docs instanceof Array )){
				console.log("Huh??? NY Times Data is not an array");
				//Exit the function if the data is not an array
				return;
			}
			else {
				nyTimesArticles = data.response.docs;
				//console.log(nyTimesArticles);
			}

			var tempArticleObj;
			for(var i = 0; i < nyTimesArticles.length; i++){
				tempArticleObj = new InstaTimesArticle(nyTimesArticles[i].headline.main, nyTimesArticles[i].snippet);
				instaTimes.push(tempArticleObj);
			}
			//*****************************//
			//Execute the Instagram API Call
			getInstagramData();
			//*****************************//
		}
	});
}

//Define the function to execute the Instagram AJAX call
function getInstagramData() {
	"use strict";
	var curTag = 'news';
	var myInstaKey = 'YOUR-DEVELOPER-KEY-GOES-HERE';
	var instagramTagSearchURL = 'https://api.instagram.com/v1/tags/' + curTag + '/media/recent?client_id=' + myInstaKey;
	//Alt Instagram API Endpoint
	var instagramPopularSearchURL = 'https://api.instagram.com/v1/media/popular?client_id=' + myInstaKey;

	$.ajax({
		url: instagramTagSearchURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(data){
			console.log("We got problems");
			console.log(data.status);
		},
		success: function(data){
			console.log("WooHoo!");
			//console.log(data);

			var instagramData;
			//Check to make sure the data is correct
			if (!(data.data instanceof Array )){
				console.log("Huh??? Instagram data is not an array");
				console.log(data);
				//Exit the function if the data is not an array
				return;
			}
			else {
				instagramData = data.data;
				for (var i = 0; i < instaTimes.length; i++){
					instaTimes[i].img = instagramData[i].images.thumbnail.url;
					$("#latestUpdates").append(
						//This is one long string of HTML markup broken into multiple lines for readability
						"<div class='articleBox'>" +
							"<p class='articleTitle'>" +
								instaTimes[i].title +
							"</p>" +
							"<div class='contentBox'>" +
								"<img class='articleImg' src=" + instaTimes[i].img + ">" +
								"<p class='articleText'>" +
									instaTimes[i].text+
								"</p>" +
							"</div>" +
						"</div>"
					);
				}
			}
		}
	});
}

//Code to be executed once the page has fully loaded
$(document).ready(function(){
	"use strict";
	$("#update").click(function(){
		console.log("Clicked Update");
		//Clear the instaTimes array
		instaTimes = [];
		//Use jQuery to clear out the previous items
		$("#latestUpdates").empty();
		//Execute the API Call
		getNYTimesData();
	});
});
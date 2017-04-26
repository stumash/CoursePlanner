var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var COMP_SOEN_courses_site = "https://www.concordia.ca/academics/undergraduate/calendar/current/sec71/71-70.html#b71.70.9";
var all_other_courses_site = "https://www.concordia.ca/academics/undergraduate/calendar/current/sec71/71-60.html";

request(COMP_SOEN_courses_site, function (err, body, html) {
		// console.log(html);

		var $ = cheerio.load(html);
    	var basePoint = "div.reference.parbase.section"; // css selector
    	var COMP = $(basePoint).next().children().children().last().prev().prev().text();
    	var SOEN = $(basePoint).next().children().children().last().text();	
    	// console.log(COMP, "\n\n\n", SOEN);
    	extractData(COMP);
	}
);

// function removeGarbage(courses){
// 	course.forEach(function(i){
// 		if()
// 	});
// }

function debug(item, index){
   	console.log(item);
   	console.log("\nok");
}

function extractData(text){
	var stus_sexy_regex = /(?=([[A-Z]{4} [0-9]{3}\s+?[A-Z][a-z]+))/g; // dat positive lookahead doe

   	text = text.split(stus_sexy_regex);

   	for(var i = text.length-1; i >= 0; i--){
     	if(i % 2 === 1)
   			text.splice(i, 1);
   	}

    // text.forEach(debug);

    var line = "";
    var courseCodeRgx = /[A-Z]{4}\s\d{3}/;
    var courseNameRgx = /[A-Z][a-z].+(?= \()/;
    var creditsRgx = /\d(\.\d+)?(?= credits)/;
    var firstLineRgx = /Prerequisite:.+(?:\d\.)/;
    var prereqsRgx = /[A-Z]{4}\s\d{3}|d{3}/g;
    var descriptionRgx = /((\d{3}\.) |ent\. |ram\. ).+((\n*?.+)\n?((?=NOTE)|((?:week\.)*(.+|\n?)(?:week\.)*(.+|\n?)(?:week\.)(.+|\n?)))?)/
    var notesRgx = /NOTE.+/;
    var courseCode, courseName, credits, firstLine, prereqs, description, notes, iterator;

    for(i = 0; i < text.length; i++){
    	iterator = text[i];
    	// console.log(iterator+"\n");
    	courseCode = iterator.match(courseCodeRgx) || ""; // null coalescing properties of javascript's || operator
    	courseName = iterator.match(courseNameRgx) || "";
    	credits = iterator.match(creditsRgx) || "";
    	firstLine = iterator.match(firstLineRgx) || "";
    	// prereqs = firstLine.match(prereqsRgx) || "";
    	description = iterator.match(descriptionRgx) || "";
    	notes = iterator.match(notesRgx) || "";


    	line = courseCode + "#" + courseName + "#" + credits + "#" + description + "#" + notes;
    	console.log(line);
    }

}
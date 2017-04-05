var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var COMP_SOEN_courses_site = "https://www.concordia.ca/academics/undergraduate/calendar/current/sec71/71-70.html#b71.70.9";

request(COMP_SOEN_courses_site, function (err, body, html) {
    // console.log(err || body); // Print out the HTML
    var $ = cheerio.load(html);
    var divClassSelector = "div.reference.parbase.section"; 
    for(var j = 1; j < 43; j++){  
	    var courseCode = $(divClassSelector).next().children().children().last().prev().prev().find('b').eq(j);
	    if(courseCode.text() === "")
	    	courseCode = $(divClassSelector).next().children().children().last().prev().prev().find('b').eq(++j);
		var courseCredits = courseCode[0].nextSibling.nodeValue;
		if(courseCredits === null)
			courseCredits = courseCode[0].nextSibling.nextSibling.nextSibling.nextSibling.nodeValue;
		var coursePrereqs = courseCode[0].nextSibling.nextSibling.nextSibling.nodeValue;
		if(coursePrereqs === null)
			coursePrereqs = courseCode[0].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue;

		extractCourseData(courseCode.text(), courseCredits, coursePrereqs);
	}
});

// A function that returns one line of course info in csv format
function extractCourseData(code, credits, info){
	var courseCode = code.trim().slice(0, 8);
	var courseName = code.trim().slice(9, code.length).trim();
	var courseCredits = credits.trim();
	courseCredits = courseCredits.slice(1, credits.length-1).replace(/\s\w+\)/g, "").replace(/\s\w+/g, "");
	var i = 0;
	var courseInfo;
	
	// Extract first sentence of course description for pre/coreqs
	while(i < info.length-1){
		courseInfo += info.charAt(i);
		i++;
		if(info.charAt(i) === ".")
			break;
	}

	var infoArray = courseInfo.split(";");
	var prereqs = "";
	var coreqs = "";

	for(i = 0; i < infoArray.length; i++){
		// Sidenote: we need to support the fact that you can have X OR Y as a prereq for something
		// For now this will only scan for the first match and take it
		// Perhaps we can use "&" to sybolize logical ands and "+" for logical ors
		var required = infoArray[i].match(/[A-Z]{4}\s\d{3}/);
		//booleans
		var nextLast = i >= infoArray.length-1;
		var matchExists = required !== null;
		
		if(infoArray[i].includes("concurrently")){
			if(matchExists)
				coreqs += required[0];
			if(!nextLast)
				coreqs += ";";
		}
		else{
			if(matchExists)
				prereqs += required[0];
			if(!nextLast)
				prereqs += ";";
		}
	}
	// Course data
	var line = courseName + '#' + courseCode + '#' + courseCredits + "#" + prereqs + "#" + coreqs;

	console.log("line: " + line);
	// console.log("info: " + info);
}

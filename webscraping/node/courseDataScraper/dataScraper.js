var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var COMP_SOEN_courses_site = "https://www.concordia.ca/academics/undergraduate/calendar/current/sec71/71-70.html#b71.70.9";
var all_other_courses_site = "https://www.concordia.ca/academics/undergraduate/calendar/current/sec71/71-60.html";
var ctr = 0;

request(COMP_SOEN_courses_site, function (err, body, html) {
    // console.log(err || body); // Print out the HTML
    var $ = cheerio.load(html);
    var divClassSelector = "div.reference.parbase.section"; // base reference point
    
    // for COMP courses
    var iTags = $(divClassSelector).next().children().children().last().prev().prev().find('i').text(); //this gets coursenames and NOTES 
    iTags = iTags.replace(/[a-z][A-M|O-Z]/g, "e      C"); // seperate 'glued' classes (those randomly not seperated by whitespaces), in this case "eC"
    iTags = iTags.replace(/[a-z]\.[A-M,O-Z]/g, "t.      A"); // get rid of "t.A", will need a better way of handling this...
    var courseNamesAndNotes = iTags.split(/\s\s\s\s\s\s/g || /\s\s\s\s\s\s\s/g);
    // trim away extra leading whitespaces
    for(var x = 0; x < courseNamesAndNotes.length; x++){
    	courseNamesAndNotes[x] = courseNamesAndNotes[x].trim();
    }

    var iTagsCtr = 1;

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
		// in some cases this string ends with a hypen, meaning that there is a <br> element seperating the rest of the description
		if(coursePrereqs.charAt(coursePrereqs.length-1) === "-"){
			// get rid of said hypen
			coursePrereqs = coursePrereqs.slice(0, -1);
			// append the rest of the description
			var additionalInfo = courseCode[0].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue;
			if(additionalInfo === null)
				additionalInfo = courseCode[0].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue;
			coursePrereqs += additionalInfo.replace(/[\n\r]/g, ''); // get rid of unwanted newline characters
		}
	    var courseName = courseCode.text().trim().slice(9, courseCode.text().length).trim();
	    var courseNotes = "";
	    if(courseNamesAndNotes[iTagsCtr].slice(0, courseName.length) === courseName){
	    	courseNotes = courseNamesAndNotes[iTagsCtr].replace(courseName, '');
	    	iTagsCtr++;
	    }
		extractCourseData(courseCode.text(), courseCredits, coursePrereqs, courseNotes);
	}
	// for SOEN courses
	iTagsCtr = 1;

	iTags = $(divClassSelector).next().children().children().last().find('i').text();
    iTags = iTags.replace(/[a-z][A-M|O-Z]/g, "e      C"); // seperate 'glued' classes (those randomly not seperated by whitespaces), in this case "eC"
    iTags = iTags.replace(/[a-z]\.[A-M,O-Z]/g, "t.      A"); // get rid of "t.A", will need a better way of handling this...
    courseNamesAndNotes = iTags.split(/\s\s\s\s\s\s/g || /\s\s\s\s\s\s\s/g);
    // trim away extra leading whitespaces
    for(x = 0; x < courseNamesAndNotes.length; x++){
    	courseNamesAndNotes[x] = courseNamesAndNotes[x].trim();
    }
	for(j = 1; j < 24; j++){
	    let courseCode = $(divClassSelector).next().children().children().last().find('b').eq(j);
	    if(courseCode.text() === "")
	    	courseCode = $(divClassSelector).next().children().children().last().find('b').eq(++j);
		let courseCredits = courseCode[0].nextSibling.nodeValue;
		if(courseCredits === null)
			courseCredits = courseCode[0].nextSibling.nextSibling.nextSibling.nextSibling.nodeValue;
		let coursePrereqs = courseCode[0].nextSibling.nextSibling.nextSibling.nodeValue;
		if(coursePrereqs === null)
			coursePrereqs = courseCode[0].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue;
				// in some cases this string ends with a hypen, meaning that there is a <br> element seperating the rest of the description
		if(coursePrereqs.charAt(coursePrereqs.length-1) === "-"){
			// get rid of said hypen
			coursePrereqs = coursePrereqs.slice(0, -1);
			// append the rest of the description
			let additionalInfo = courseCode[0].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue;
			if(additionalInfo === null)
				additionalInfo = courseCode[0].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue;
			coursePrereqs += additionalInfo.replace(/[\n\r]/g, ''); // get rid of unwanted newline characters
		}
		let courseName = courseCode.text().trim().slice(9, courseCode.text().length).trim();
	    let courseNotes = "";
	    if(courseNamesAndNotes[iTagsCtr].slice(0, courseName.length) === courseName){
	    	courseNotes = courseNamesAndNotes[iTagsCtr].replace(courseName, '');
	    	iTagsCtr++;
	    }

		extractCourseData(courseCode.text(), courseCredits, coursePrereqs, courseNotes);
	}
});

// A function that returns one line of course info in csv format
function extractCourseData(code, credits, info, notes){
	var courseCode = code.trim().slice(0, 8);
	var courseName = code.trim().slice(9, code.length).trim();
	var courseCredits = credits.trim();
	courseCredits = courseCredits.slice(1, credits.length-1).replace(/\s\w+\)/g, "").replace(/\s\w+/g, "");
	var i = 0;
	var courseInfo;
	var courseDescription;
	var courseNotes = notes;
	var semestersOffered = "";
	
	// Extract first sentence of course description for pre/coreqs
	while(i < info.length-1){
		courseInfo += info.charAt(i);
		i++;
		if(info.charAt(i) === "."){
			courseDescription = info.slice(i+1, info.length-1).trim() + ".";
			break;
		}
	}

	var infoArray = courseInfo.split(/\;|\,/g);
	var prereqs = "";
	var coreqs = "";
	var courseCodeRegex = /[A-Z]{4}\s\d{3}|\d{3}/g;

	for(i = 0; i < infoArray.length; i++){
		// Sidenote: we need to support the fact that you can have X OR Y as a prereq for something
		// For now this will only scan for the first match and take it
		// Perhaps we can use ";" to sybolize logical ands and "|" for logical ors
		var required = infoArray[i].match(courseCodeRegex);
		//booleans
		var matchExists = required !== null;
		j = 0;
		
		if(matchExists){
			var nextExists;
			// coreqs
			while(j < required.length){
				if(infoArray[i].includes("concurrently"))
					coreqs += required[j];
				if(i < infoArray.length-1)
					nextExists = infoArray[i+1].includes("concurrently");
				if(infoArray[i].includes("or") && j < required.length-1){
					// check if or between classes
					if(infoArray[i].indexOf("or") === (infoArray[i].indexOf(required[j]+required[j].length)+2) && infoArray[i].indexOf("or") === infoArray[i].indexOf(required[j+1])-3)
						coreqs += "|";
				}if(infoArray[i].includes("and") && j < required.length-1){
					// check if and between classes
					if(infoArray[i].indexOf("and") === (infoArray[i].indexOf(required[j]+required[j].length)+2) && infoArray[i].indexOf("and") === infoArray[i].indexOf(required[j+1])-3)
						coreqs += ";";
				}
				else if(i < infoArray.length-1 && coreqs !== "" && nextExists)
					coreqs += ";";
				j++;
			}
			// prereqs
			j = 0;
			while(j < required.length){
				if(!infoArray[i].includes("concurrently"))
					prereqs += required[j];
				if(i < infoArray.length-1)
					nextExists = !infoArray[i+1].includes("concurrently");
				if(infoArray[i].includes("or") && j < required.length-1){
					// check if or between classes
					if(infoArray[i].indexOf("or") > (infoArray[i].indexOf(required[j]+required[j].length)) && infoArray[i].indexOf("or") < infoArray[i].indexOf(required[j+1]))
						prereqs += "|";
				}else if(i < infoArray.length-1 && prereqs !== "" && nextExists)
					prereqs += ";";
				j++;

			}

		}

	}
	// Course data
	var line = courseName + '#' + courseCode + '#' + courseCredits + "#" + prereqs + "#" + coreqs + "#" + semestersOffered + "#" + courseNotes + "#";
	// ctr++;
	console.log(line);
	// console.log(ctr);
}

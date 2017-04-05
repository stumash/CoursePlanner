var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var COMP_SOEN_courses_site = "https://www.concordia.ca/academics/undergraduate/calendar/current/sec71/71-70.html#b71.70.9";

request(COMP_SOEN_courses_site, function (err, body, html) {
    // console.log(err || body); // Print out the HTML
    var $ = cheerio.load(html);
    var divClassSelector = "div.reference.parbase.section";
   
    var courseCode = $(divClassSelector).next().children().children().last().prev().prev().find('b').eq(8);
	console.log(courseCode.text());

	var courseCredits = courseCode[0].nextSibling.nodeValue;
	console.log(courseCredits);

	var coursePrereqs = courseCode[0].nextSibling.nextSibling.nextSibling.nodeValue;
	console.log(coursePrereqs);
});

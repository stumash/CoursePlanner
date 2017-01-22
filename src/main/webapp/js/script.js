$(document).ready(function(){

    var courseList = {
        "semesterList":	[
            {
                "season": "fall",
                "year": "2016",
                "courseList": [
                    {
                        "code": "COMP 232",
                        "name": "Mathematics for Computer Science",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "COMP 248",
                        "name": "Object Oriented Programming I",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "ENGR 201",
                        "name": "Professional Practice and Responsibility",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "1.5"
                    },
                    {
                        "code": "ENGR 213",
                        "name": "Applied Ordinary Differential Equations",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "",
                        "name": "",
                        "isElective": "true",
                        "electiveType": "Science",
                        "credits": ""
                    }
                ]
            },
            {
                "season": "winter",
                "year": "2017",
                "courseList": [
                    {
                        "code": "COMP 249",
                        "name": "Object Oriented Programming II",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "ENGR 233",
                        "name": "Applied Advanced Calculus",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 228",
                        "name": "System Hardware",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "4"
                    },
                    {
                        "code": "SOEN 287",
                        "name": "Introduction to Web Applications",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "",
                        "name": "",
                        "isElective": "true",
                        "electiveType": "Science",
                        "credits": ""
                    }
                ]
            },
            {
                "season": "summer",
                "year": "2017",
                "courseList": [
                    {
                        "code": "COMP 348",
                        "name": "Principles of Programming Languages",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "COMP 352",
                        "name": "Data Structures and Algorithms",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "ENCS 282",
                        "name": "Technical Writing and Communication",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "ENGR 202",
                        "name": "Sustainable Development and Environmental Stewardship",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "1.5"
                    },
                    {
                        "code": "",
                        "name": "",
                        "isElective": "true",
                        "electiveType": "General",
                        "credits": ""
                    }
                ]
            },
            {
                "season": "fall",
                "year": "2017",
                "courseList": []
            },
            {
                "season": "winter",
                "year": "2018",
                "courseList": [
                    {
                        "code": "COMP 346",
                        "name": "Operating Systems",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "4"
                    },
                    {
                        "code": "ELEC 275",
                        "name": "Principles of Electrical Engineering",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3.5"
                    },
                    {
                        "code": "ENGR 371",
                        "name": "Probability and Statistics in Engineering",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 331",
                        "name": "Introduction to Formal Methods for Software Engineering",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 341",
                        "name": "Software Process",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    }
                ]
            },
            {
                "season": "summer",
                "year": "2018",
                "courseList": []
            },
            {
                "season": "fall",
                "year": "2018",
                "courseList": [
                    {
                        "code": "COMP 335",
                        "name": "Introduction to Theoretical Computer Science",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 342",
                        "name": "Software Requirements and Specifications",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 343",
                        "name": "Software Architecture and Design I",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 384",
                        "name": "Management Measurement and Quality Control",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "ENGR 391",
                        "name": "Numerical Methods in Engineering",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    }
                ]
            },
            {
                "season": "winter",
                "year": "2019",
                "courseList": [
                    {
                        "code": "SOEN 344",
                        "name": "Software Architecture and Design II",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 345",
                        "name": "Software Testing, Verification and Quality Assurance",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 357",
                        "name": "User Interface Design",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 390",
                        "name": "Software Engineering Team Design Project",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3.5"
                    },
                    {
                        "code": "",
                        "name": "",
                        "isElective": "true",
                        "electiveType": "Program",
                        "credits": ""
                    }
                ]
            },
            {
                "season": "summer",
                "year": "2019",
                "courseList": []
            },
            {
                "season": "fall",
                "year": "2019",
                "courseList": [
                    {
                        "code": "SOEN 490",
                        "name": "Capstone Software Engineering Design Project",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "4"
                    },
                    {
                        "code": "ENGR 301",
                        "name": "Engineering Management Principles and Economics",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 321",
                        "name": "Information Systems Security",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "",
                        "name": "",
                        "isElective": "true",
                        "electiveType": "Program",
                        "credits": ""
                    },
                    {
                        "code": "",
                        "name": "",
                        "isElective": "true",
                        "electiveType": "Program",
                        "credits": ""
                    }
                ]
            },
            {
                "season": "winter",
                "year": "2020",
                "courseList": [
                    {
                        "code": "SOEN 385",
                        "name": "Control Systems",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "ENGR 392",
                        "name": "Impact of Technology on Society",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "3"
                    },
                    {
                        "code": "SOEN 490",
                        "name": "Capstone Software Engineering Design Project",
                        "isElective": "false",
                        "electiveType": "",
                        "credits": "4"
                    },
                    {
                        "code": "",
                        "name": "",
                        "isElective": "true",
                        "electiveType": "Program",
                        "credits": ""
                    },
                    {
                        "code": "",
                        "name": "",
                        "isElective": "true",
                        "electiveType": "Program",
                        "credits": ""
                    }
                ]
            }
        ]
    };
    populatePage(courseList);

	$("button.toggle").html("&#x25B2");

    $("button.toggle").click(function(){
    	var $courses =  $(this).parent().parent().children(".courseContainer");

    	if($courses.is(":hidden")){
			$(this).html("&#x25B2");    
		}else{
			$(this).html("&#x25BC");
		}

        $courses.slideToggle();

    });

    $("div.course").click(function(){

		console.log($(this).find(".left").html());

		var code = $(this).find(".left").html();

		if(code !== "-" && code !== ""){
			var requestBody = {
                "code": code
            };

            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", function(){

            	var response = JSON.parse(this.responseText);

            	var name = response.name;
            	var credits = response.credits;
            	var code = response.code;
            	var notes = response.notes || "";

            	var termsOffered = "";
            	if(response.termsOffered){
                    if(response.termsOffered.includes("f"))
                        termsOffered = termsOffered + "fall ";
                    if(response.termsOffered.includes("w"))
                        termsOffered = termsOffered + "winter ";
                    if(response.termsOffered.includes("s"))
                        termsOffered = termsOffered + "summer ";
				}

                var prereqs = "";
            	if(response.prereqs){
            		console.log("we have some prereqs");
                    for(var i = 0; i < response.prereqs.length; i++){
                        prereqs = prereqs + response.prereqs[i] + ", ";
                    }
				}

                var coreqs = "";
                if(response.coreqs){
                    for(var j = 0; j < response.coreqs.length; j++){
                        coreqs = coreqs + response.coreqs[j] + ", ";
                    }
				}

				prereqs = prereqs || "None";
                coreqs = coreqs || "None";
                termsOffered = termsOffered || "None";
                notes = notes || "None";

				$("p.info").html("<b>Prerequisites:</b> " + prereqs + "<br>" +
								"<b>Corequisites:</b> " + coreqs + "<br>" +
								"<b>Terms offered:</b> " + termsOffered + "<br>" +
								"<b>Notes:</b> " + notes);

                console.log(this.responseText);

			});
            oReq.open("POST", "http://138.197.6.26/courseplanner/courseinfo");
            oReq.send(JSON.stringify(requestBody));

		}

		sendSequence();

		//$(this).child(".left").html();

	});

    $("button.search").click(function(){
		var code = courseList.semesterList[0].courseList[0].code.toString();
		var name = courseList.semesterList[0].courseList[0].name.toString();
		var credits = courseList.semesterList[0].courseList[0].credits.toString();
		var length = courseList.semesterList.length;
		var $left = $("button.toggle").parent().parent().children(".left");

		generateSequenceObject(function(){
			console.log("Final callback called");
		});

		// $(".scheduleContainer .term:nth-of-type(2) .courseContainer .course:first-of-type .left").html(code);
		// $(".scheduleContainer .term:nth-of-type(2) .courseContainer .course:first-of-type .center").html(name);
		// $(".scheduleContainer .term:nth-of-type(2) .courseContainer .course:first-of-type .right").html(credits);	
	}); // <-- don't delete me plz
    $(function(){
    	$(".courseContainer, .semesterHeader").sortable({
    		connectWith: ".courseContainer"
    	}).disableSelection();
  	});
});

function populatePage(courseSequenceObject){
	for(var i = 0; i < courseSequenceObject.semesterList.length; i++){
		if(courseSequenceObject.semesterList[i].courseList.length === 0){
			$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + 1 + ") .left").html("-");
			$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + 1 + ") .center").html("Work Term");
			$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + 1 + ") .right").html("-");
		} else {
			for(var j = 0; j < courseSequenceObject.semesterList[i].courseList.length; j++){
				if(courseSequenceObject.semesterList[i].courseList[j].isElective === "true"){
					var electiveType = courseSequenceObject.semesterList[i].courseList[j].electiveType.toString();
					$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + (j + 1) + ") .left").html("-");
					$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + (j + 1) + ") .center").html(electiveType + " Elective");
					$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + (j + 1) + ") .right").html("-");
				}else{
					var code = courseSequenceObject.semesterList[i].courseList[j].code.toString();
					var name = courseSequenceObject.semesterList[i].courseList[j].name.toString();
					var credits = courseSequenceObject.semesterList[i].courseList[j].credits.toString();
					$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + (j + 1) + ") .left").html(code);
					$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + (j + 1) + ") .center").html(name);
					$(".scheduleContainer .term:nth-of-type(" + (i + 1) + ") .courseContainer .course:nth-of-type(" + (j + 1) + ") .right").html(credits);
				}
			}
		}
	}
}

function generateSequenceObject(callback){
	var semesterList = [];
	var count = 0;
	var onFinish = function(semesterObject){
        console.log("Semester object: " + semesterObject);
        if(semesterObject.courseList) {
            semesterList.push(semesterObject);
        }
        count++;
        if(count === 15){
            console.log("Semester list:");
            console.log(semesterList);
            callback(semesterList);
        }
	};
	for(var i = 1; i <= 15; i++){
		getSemesterObject($(".scheduleContainer .term:nth-of-type(" + i + ")"), onFinish);
	}
}

function getSemesterObject($semesterContainer, callback){
	var seasonText = $semesterContainer.find(".semesterHeading").text().split(" ")[0].trim().toLowerCase();
	console.log(seasonText);
	var courseList = [];
	var count = $semesterContainer.find(".course").length;
	$semesterContainer.find(".course").each(function(i, obj){
		var courseObject = getCourseObject($(this));
		if(courseObject){
			courseList.push(courseObject);
			console.log(courseObject);
		} else {
            courseList = [];
		}
		if(i === count-1){
			callback({"season" : seasonText, "courseList": courseList});
		}
	});
}

function getCourseObject($courseContainer){

	var result = "hi";

    var code = $courseContainer.find(".left").text();
    var name = $courseContainer.find(".center").text();

    if(name.includes("Work Term") || name === ""){
    	console.log("returning undefined");
    	result = undefined;
	}

    var credits = $courseContainer.find(".right").text();
	var isElective = $courseContainer.find(".center").text().includes("Elective");
    var electiveType = "";

	if(isElective){
		electiveType = $courseContainer.find(".center").text().replace(" Elective", "");
		code = "";
		name = "";
		credits = "";
	}

	if(result){
		result = {
            "code": code,
            "name": name,
            "credits": credits,
            "isElective": isElective,
            "electiveType": electiveType
        };
	}

	return result;
}

function sendSequence(){
    generateSequenceObject( function(result){
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(){

            var response = JSON.parse(this.responseText);
            console.log(this.responseText);

        });
        oReq.open("POST", "http://138.197.6.26/courseplanner/validate");
        oReq.send(JSON.stringify({
        	"semesterList": result
        }));
	});
}




$(document).ready(function(){

    loadDefaultSequence();

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

    $("div.course").mousedown(function(){

    	var $courseRow = $(this);
    	$courseRow.addClass("grabbed");

	});

    $("div.course").mouseup(function(){

        var $courseRow = $(this);
        $courseRow.removeClass("grabbed");

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

	}); // <-- don't delete me plz
    $(function(){
    	$(".courseContainer, .semesterHeader").sortable({
    		connectWith: ".courseContainer"
    	}).disableSelection();
  	});
});

//TODO: create function that takes i,j params and name/code/credits and sets the text of that row
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

function loadDefaultSequence(){

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){

        var courseList = JSON.parse(this.responseText);
        populatePage(courseList);

    });
    oReq.open("GET", "http://138.197.6.26/courseplanner/defaultSequence.json");
    oReq.send();

}



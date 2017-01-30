//asks to confirm refresh page click event or when F5 is pressed
window.onbeforeunload = function(e) {
	return undefined;
};

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

		var code = $(this).find(".left").html();

		if(code !== "-" && code !== ""){
			var requestBody = {
                "code": code
            };

            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", function(){

            	var response = JSON.parse(this.responseText);
            	fillCourseInfoBox(response);

			});
            oReq.open("POST", "http://138.197.6.26/courseplanner/courseinfo");
            oReq.send(JSON.stringify(requestBody));

		}

		validateSequence();

	});

    $("button.search").click(function(){
		// var code = courseList.semesterList[0].courseList[0].code.toString();
		// var name = courseList.semesterList[0].courseList[0].name.toString();
		// var credits = courseList.semesterList[0].courseList[0].credits.toString();
		// var length = courseList.semesterList.length;
		// var $left = $("button.toggle").parent().parent().children(".left");

	});
    $(function(){
    	$(".courseContainer, .semesterHeader").sortable({
    		connectWith: ".courseContainer"
    	}).disableSelection();
  	});
});

function populatePage(courseSequenceObject){
	for(var i = 0; i < courseSequenceObject.semesterList.length; i++){
		if(courseSequenceObject.semesterList[i].courseList.length === 0){
			setCourseRowData(i, 0, "-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "Work Term", "-");
		} else {
			for(var j = 0; j < courseSequenceObject.semesterList[i].courseList.length; j++){
				if(courseSequenceObject.semesterList[i].courseList[j].isElective === "true"){
					var electiveType = courseSequenceObject.semesterList[i].courseList[j].electiveType.toString();
                    setCourseRowData(i, j, "-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", electiveType + " Elective", "-");
				}else{
					var code = courseSequenceObject.semesterList[i].courseList[j].code.toString();
					var name = courseSequenceObject.semesterList[i].courseList[j].name.toString();
					var credits = courseSequenceObject.semesterList[i].courseList[j].credits.toString();
                    setCourseRowData(i, j, code, name, credits);
				}
			}
		}
	}
}

function setCourseRowData(termIndex, courseIndex, code, name, credits){
	var $courseRow = $(".scheduleContainer .term:nth-of-type(" + (termIndex + 1) + ") .courseContainer .course:nth-of-type(" + (courseIndex + 1) + ")");
	$courseRow.find(".left").html(code);
    $courseRow.find(".center").html(name);
    $courseRow.find(".right").html(credits);
}

function generateSequenceObject(callback){
	var semesterList = [];
	var count = 0;
	var onFinish = function(semesterObject){
        if(semesterObject.courseList) {
            semesterList.push(semesterObject);
        }
        count++;
        if(count === 15){
            callback(semesterList);
        }
	};
	for(var i = 1; i <= 15; i++){
		getSemesterObject($(".scheduleContainer .term:nth-of-type(" + i + ")"), onFinish);
	}
}

function getSemesterObject($semesterContainer, callback){
	var seasonText = $semesterContainer.find(".semesterHeading").text().split(" ")[0].trim().toLowerCase();
	var courseList = [];
	var count = $semesterContainer.find(".course").length;
	$semesterContainer.find(".course").each(function(i, obj){
		var courseObject = getCourseObject($(this));
		if(courseObject){
			courseList.push(courseObject);
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

function validateSequence(){
    generateSequenceObject( function(result){
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(){

            var response = JSON.parse(this.responseText);
            console.log("Server validation response: " + this.responseText);

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
    oReq.open("GET", "http://138.197.6.26/courseplanner/js/defaultSequence.json");
    oReq.send();

}

function fillCourseInfoBox(courseInfo){

    var name = courseInfo.name;
    var credits = courseInfo.credits;
    var code = courseInfo.code;
    var notes = courseInfo.notes || "";

    var termsOffered = "";
    if(courseInfo.termsOffered){
        if(courseInfo.termsOffered.includes("f"))
            termsOffered = termsOffered + "fall ";
        if(courseInfo.termsOffered.includes("w"))
            termsOffered = termsOffered + "winter ";
        if(courseInfo.termsOffered.includes("s"))
            termsOffered = termsOffered + "summer ";
    }

    var prereqs = "";
    if(courseInfo.prereqs){
        for(var i = 0; i < courseInfo.prereqs.length; i++){
            prereqs = prereqs + courseInfo.prereqs[i] + ", ";
        }
    }

    var coreqs = "";
    if(courseInfo.coreqs){
        for(var j = 0; j < courseInfo.coreqs.length; j++){
            coreqs = coreqs + courseInfo.coreqs[j] + ", ";
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


}



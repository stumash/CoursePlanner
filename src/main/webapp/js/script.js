//variable used to ensure the sequence is only validated once per view update
var draggingItem = false;

//asks to confirm refresh page click event or when F5 is pressed
window.onbeforeunload = function(e) {
	return undefined;   //silenced for now, but not forgotten
};

$(document).ready(function(){

    // call functions needed to set up the page
    loadSequence();
    getCourseList();

    // set up event listeners for static elements
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

    $("#classSearch").bind("enterKey",function(e){
        requestCourseInfo($("#classSearch").val());
    });

    $("#classSearch").keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });

    $("button.search").click(function(){
        requestCourseInfo($("#classSearch").val());
	});

    $(".exportButton").click(function(){
        exportSequence();
    });

});

function loadSequence(){

    var savedSequence = JSON.parse(localStorage.getItem("savedSequence"));

    if(savedSequence === null){
        // load the default sequence
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(){

            var courseList = JSON.parse(this.responseText);
            populatePage(courseList);

        });
        oReq.open("GET", "http://138.197.6.26/courseplanner/js/defaultSequence.json");
        oReq.send();
        console.log("true");
    } else {
        // load the saved sequence
        populatePage(savedSequence);
        validateSequence(savedSequence);
    }
}

function populatePage(courseSequenceObject){
	for(var i = 0; i < courseSequenceObject.semesterList.length; i++){
	    var $courseContainer = $(".sequenceContainer .term:nth-of-type(" + (i + 1) +") .courseContainer");
		if(courseSequenceObject.semesterList[i].courseList.length === 0){
            addCourseRow($courseContainer, "-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "Work Term", "-");
		} else {
			for(var j = 0; j < courseSequenceObject.semesterList[i].courseList.length; j++){
				if(courseSequenceObject.semesterList[i].courseList[j].isElective === "true" || courseSequenceObject.semesterList[i].courseList[j].isElective === true){
					var electiveType = courseSequenceObject.semesterList[i].courseList[j].electiveType.toString();
                    addCourseRow($courseContainer, "-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", electiveType + " Elective", "-");
				}else{
					var code = courseSequenceObject.semesterList[i].courseList[j].code.toString();
					var name = courseSequenceObject.semesterList[i].courseList[j].name.toString();
					var credits = courseSequenceObject.semesterList[i].courseList[j].credits.toString();
                    addCourseRow($courseContainer, code, name, credits);
				}
			}
		}
	}

    // add UI event listeners AFTER we've built all the html

    $("div.course").mousedown(function(){
        $(this).addClass("grabbed");
    });

    $("div.course").mouseup(function(){
        $(this).removeClass("grabbed");
    });

    $("div.course").click(function(){
        var code = $(this).find(".left").html();

        if(code !== "-" && code !== ""){
            requestCourseInfo(code);
        }
    });

    $(".courseContainer, .semesterHeader").sortable({
        connectWith: ".courseContainer",
        //change event gets called when an item is dragged into a new position (including its original position)
        change: function(event, ui) {
            var centerText = $(ui.item).find(".center").text();
            var index = ui.placeholder.index();
            draggingItem = true;
        },
        //update event gets invoked when an item is dropped into a new position (excluding its original position)
        update: function(event, ui) {
            if(draggingItem){
                generateSequenceObject(function(result){
                    localStorage.setItem("savedSequence", JSON.stringify(result));
                    validateSequence(result);
                });
            }
            draggingItem = false;
        }
    }).disableSelection();
}

function requestCourseInfo(code){
    code = code.toUpperCase();

    var requestBody = {
        "code": code
    };

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){

        var response = JSON.parse(this.responseText);
        console.log("Server course-info response: " + this.responseText);
        fillCourseInfoBox(response);

    });
    oReq.open("POST", "http://138.197.6.26/courseplanner/courseinfo");
    oReq.send(JSON.stringify(requestBody));
}

function addCourseRow($courseContainer, code, name, credits){
    var rowHtml = "<div class='course'><div class='left'>" + code +"</div><div class='center'>" + name +"</div><div class='right'>" + credits +"</div></div>";
    $courseContainer.append(rowHtml);
}

function validateSequence(sequenceObject){

    clearAllHighlights();

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){

        var response = JSON.parse(this.responseText);
        console.log("Server validation response: " + this.responseText);

        var $errorBox = $(".errorBox .error");
        var $container = $(".errorBox");
        if(response.valid === "true"){
            $container.addClass("valid");
            $container.removeClass("invalid");
            $errorBox.text("Current sequence is valid");
        } else {
            $container.addClass("invalid");
            $container.removeClass("valid");
            $errorBox.html("Current sequence is invalid:</br>");
            for(var i = 0; i < response.issues.length; i++){
                var message = response.issues[i].message;
                $errorBox.append("</br> - " + message + "</br>");
                highlightAffectedCourses(response.issues[i].affectedCourses);
            }
        }

    });
    oReq.open("POST", "http://138.197.6.26/courseplanner/validate");
    oReq.send(JSON.stringify(sequenceObject));
}

function clearAllHighlights(){
    $(".course.invalid").removeClass("invalid");
}

function highlightAffectedCourses(affectedCourses){
    for(var i = 0; i < affectedCourses.length; i++){
        var course = affectedCourses[i];
        var $courseRow = $(".course .left:contains('" + course + "')");
        $courseRow.parent().addClass("invalid");
    }
}

function generateSequenceObject(callback){
	var semesterList = [];
	var count = 0;
	var onFinish = function(semesterObject){
        if(semesterObject) {
            semesterList.push(semesterObject);
        }
        count++;
        if(count === 15){
            callback({ "semesterList" : semesterList});
        }
	};
	for(var i = 1; i <= 15; i++){
		getSemesterObject($(".sequenceContainer .term:nth-of-type(" + i + ")"), onFinish);
	}
}

function getSemesterObject($semesterContainer, callback){
	var seasonText = $semesterContainer.find(".semesterHeading").text().split(" ")[0].trim().toLowerCase();
	var courseList = [];
	var $courses = $semesterContainer.find(".course");
    var count = $courses.length;
    var isWorkTerm = false;
	if(count > 0){
        $courses.each(function(i, obj){
            var courseObject = getCourseObject($(this));
            if(courseObject){
                courseList.push(courseObject);
            } else {
                courseList = [];
                isWorkTerm = true;
            }
            if(i === count-1){
                callback({"season" : seasonText, "courseList": courseList, "isWorkTerm": isWorkTerm});
            }
        });
    } else {
	    // ignore the empty terms by regarding them as undefined
        callback(undefined);
    }
}

function getCourseObject($courseContainer){
    var code = $courseContainer.find(".left").text();
    var name = $courseContainer.find(".center").text();

    if(name.includes("Work Term")){
    	return undefined;
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

	return {
        "code": code,
        "name": name,
        "credits": credits,
        "isElective": isElective,
        "electiveType": electiveType
    };
}

function fillCourseInfoBox(courseInfo){

    if($.isEmptyObject(courseInfo)){
        $("p.info").html("Requested information for invalid course code");
    } else {
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
}

function exportSequence(){
    $("#exportWaiting").css("display","inline-block");
    generateSequenceObject( function(result){
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(){

            var response = JSON.parse(this.responseText);
            console.log("Server export response: " + this.responseText);

            if(response.exportPath){
                var downloadUrl = "http://138.197.6.26/courseplanner" + response.exportPath;
                saveAs(downloadUrl, "MySequence.pdf");
                $("#exportWaiting").css("display","none");
            }

        });
        oReq.open("POST", "http://138.197.6.26/courseplanner/export");
        oReq.send(JSON.stringify(result));
    });
}

function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); // Firefox requires the link to be in the body
        link.download = filename;
        link.href = uri;
        link.click();
        document.body.removeChild(link); // remove the link when done
    } else {
        location.replace(uri);
    }
}

// grab list of course codes from server and setup autocomplete for the search bar
function getCourseList(){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){

        var response = JSON.parse(this.responseText);

        $("#classSearch").autocomplete({
            source: response.codes
        });

    });
    oReq.open("GET", "http://138.197.6.26/courseplanner/courselist");
    oReq.send();
}



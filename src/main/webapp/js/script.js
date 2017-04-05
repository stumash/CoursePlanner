// constants
var NUMBER_OF_YEARS = 5;

//variable used to ensure the sequence is only validated once every time the user drags a class into a new position
var draggingItem = false;

// track the number of work terms in the list
var workTermCount = 0;

// asks to confirm refresh page click event or when F5 is pressed
window.onbeforeunload = function(e){
	return undefined;   // silenced for now, but not forgotten
};

$(document).ready(function(){

    // call functions needed to set up the page
    loadSequence();
    getCourseList();

});

function loadSequence(callback){

    // clear whole page first
    $(".sequenceContainer").html("<p class='mainHeader'>Concordia Engineering Sequence Builder</p>");
    workTermCount = 0;

    var savedSequence = JSON.parse(localStorage.getItem("savedSequence"));

    if(savedSequence === null){
        // load the default sequence
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(){

            var courseList = JSON.parse(this.responseText);

            addContainers(courseList, function(){
                // fill page with default sequence
                populatePage(courseList);
                validateSequence(courseList);
                initUI();
            });

        });
        oReq.open("GET", "http://138.197.6.26/courseplanner/sequences/SOEN-General-Coop.json");
        oReq.send();
    } else {

        addContainers(savedSequence, function(){
            // fill page with the saved sequence
            populatePage(savedSequence);
            validateSequence(savedSequence);
            initUI();
        });
    }
}

function addContainers(courseList, callback){
    // load the term template
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){

        var termTemplate = this.responseText;
        var $sequenceContainer = $(".sequenceContainer");

        for(var i = 0; i < courseList.semesterList.length; i++){
            var currentSemester = courseList.semesterList[i];
            var headerText = currentSemester.season.toUpperCase() + " " + (Math.floor(i/3) + 1);
            var termHtml = termTemplate.replace("{HEADER_TEXT}", headerText);
            $sequenceContainer.append(termHtml);
        }

        callback();
    });
    oReq.open("GET", "http://138.197.6.26/courseplanner/html/termTemplate.html");
    oReq.send();
}

function populatePage(courseSequenceObject){

    // clear all course containers first as we may call this more than once
    // (this will remove all draggable course rows)
    $(".courseContainer").empty();

    for(var i = 0; i < courseSequenceObject.semesterList.length; i++){
        var $courseContainer = $(".sequenceContainer .term:nth-of-type(" + (i + 1) +") .courseContainer");
        var semester = courseSequenceObject.semesterList[i];
        if(semester.isWorkTerm === false || semester.isWorkTerm === "false"){
            for(var j = 0; j < semester.courseList.length; j++){
                var courseList = semester.courseList[j];
                if(courseList.isElective === "true" || courseList.isElective === true){
                    var electiveType = courseList.electiveType.toString();
                    addCourseRow($courseContainer, "-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", electiveType + " Elective", "-", true);
                } else {
                    var code = courseList.code.toString();
                    var name = courseList.name.toString();
                    var credits = courseList.credits.toString();
                    addCourseRow($courseContainer, code, name, credits, true);
                }
            }
        }
    }

    fillWorkTerms();
    updateTotalCredits(courseSequenceObject);
}

function updateTotalCredits(courseSequenceObject){

    for(var i = 0; i < courseSequenceObject.semesterList.length; i++){
        var $semesterHeading = $(".sequenceContainer .term:nth-of-type(" + (i + 1) +") .semesterHeading");
        var $totalCreditsDiv = $semesterHeading.find("div.totalCredits");
        var semester = courseSequenceObject.semesterList[i];
        if(semester.isWorkTerm === false || semester.isWorkTerm === "false"){
            var totalCredits = 0;
            for(var j = 0; j < semester.courseList.length; j++){
                var courseList = semester.courseList[j];
                if(courseList.isElective === "true" || courseList.isElective === true){
                    var electiveType = courseList.electiveType.toString();
                } else {
                    var credits = Number(courseList.credits);
                    totalCredits += credits;
                }
            }
            $totalCreditsDiv.html("Total credits: "+totalCredits);
        } else { // semester is a workterm
            $totalCreditsDiv.html("");
        }
    }
}

/* this function fills empty course containers with an undraggable work term row
   and removes work term rows from course containers which contain both a work term and classes */
function fillWorkTerms(){
    var $courseContainers = $(".courseContainer");

    $courseContainers.each(function(index){

        var $courseContainer = $(this);

        // if the semester doesn't contain any classes, mark it as a work term
        if($(this).html() === ""){
            addCourseRow($courseContainer, "-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "Work Term", "-", false);
            workTermCount = workTermCount + 1;
        } else {
            // if there's a work term row in a list of length greater than one, remove it
            var $courses = $courseContainer.find(".course");
            if($courses.length > 1){
                $courses.each(function(index){
                    var $course = $(this);
                    if($course.find(".center").text().indexOf("Work Term") >= 0){
                        $course.remove();
                        workTermCount = workTermCount - 1;
                    }
                });
            }
        }
    });
    console.log("Work term count: " + workTermCount);
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

function addCourseRow($courseContainer, code, name, credits, isDraggable){
    var removeDragging = "";
    if(!isDraggable){
        removeDragging = " undraggable";
    }
    var rowHtml = "<div class='course" + removeDragging + "'><div class='left'>" + code +"</div><div class='center'>" + name +"</div><div class='right'>" + credits +"</div></div>";
    $courseContainer.append(rowHtml);
}

function validateSequence(sequenceObject){

    var $errorBox = $(".errorBox .error");
    var $container = $(".errorBox");
    var loaded = false;

    clearAllHighlights();

    // inform the user we're waiting for the validation results if it's taking a long time.
    // we wait 150ms to prevent it from flashing the loading screen for only a split second
    setTimeout(function(){
        if(!loaded){
            $container.removeClass("valid");
            $container.removeClass("invalid");
            $container.addClass("loading");
            $errorBox.text("Validating sequence...");
        }
    }, 150);

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){

        loaded = true;
        $container.removeClass("loading");

        var response = JSON.parse(this.responseText);
        console.log("Server validation response: " + this.responseText);

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
	var numberOfTerms = $(".sequenceContainer .term").length;
	var onFinish = function(semesterObject){
        if(semesterObject){
            semesterList.push(semesterObject);
        }
        count++;
        if(count === numberOfTerms){
            callback({ "semesterList" : semesterList});
        }
	};
	for(var i = 1; i <= numberOfTerms; i++){
		getSemesterObject($(".sequenceContainer .term:nth-of-type(" + i + ")"), onFinish);
	}
}

function getSemesterObject($semesterContainer, callback){
	var seasonText = $semesterContainer.find(".semesterHeading .seasonText").text().split(" ")[0].trim().toLowerCase();
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

    if(name.indexOf("Work Term") >= 0){
    	return undefined;
	}

    var credits = $courseContainer.find(".right").text();
	var isElective = ($courseContainer.find(".center").text().indexOf("Elective") >= 0);
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
        var notes = courseInfo.notes;

        var termsOffered = "";
        var fallIncluded = courseInfo.termsOffered.indexOf("f") >= 0;
        var winterIncluded = courseInfo.termsOffered.indexOf("w") >= 0;
        var summerIncluded = courseInfo.termsOffered.indexOf("s") >= 0;
        if(courseInfo.termsOffered){
            if(fallIncluded){
                termsOffered = termsOffered + "fall";
                if(winterIncluded)
                    termsOffered += ", ";
            }
            if(winterIncluded){
                termsOffered = termsOffered + "winter";
                if(summerIncluded)
                    termsOffered += ", ";
            }
            if(summerIncluded){
                termsOffered = termsOffered + "summer";
            }
        }

        var prereqs = "";
        if(courseInfo.prereqs){
            for(var i = 0; i < courseInfo.prereqs.length; i++){
                prereqs = prereqs + courseInfo.prereqs[i];

                if(i !== courseInfo.prereqs.length-1)
                    prereqs += ", ";
            }
        }

        var coreqs = "";
        if(courseInfo.coreqs){
            for(var j = 0; j < courseInfo.coreqs.length; j++){
                coreqs = coreqs + courseInfo.coreqs[j];

                if(j !== courseInfo.coreqs.length-1)
                    coreqs += ", ";
            }
        }

        prereqs = prereqs || "None";
        coreqs = coreqs || "None";
        termsOffered = termsOffered || "None";

        var courseInfoInjection = "<h2><ins>" + code + " (" + credits + " credits)</ins></h2>" + "<b>Prerequisites:</b> " + prereqs + "<br>" +
            "<b>Corequisites:</b> " + coreqs + "<br>" +
            "<b>Terms offered:</b> " + termsOffered;

        if(notes !== undefined){
            courseInfoInjection += "<br>" + "<b>Notes:</b> " + notes;
        }

        $("p.info").html(courseInfoInjection);
    }
}

function exportSequence(){
    $("#exportWaiting").css("display","inline-block");
    generateSequenceObject( function(sequenceObject){
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
        oReq.send(JSON.stringify(sequenceObject));
    });
}

function saveAs(uri, filename){
    var link = document.createElement('a');
    if(typeof link.download === 'string'){
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

function resetToDefaultSequence(){
    if(confirm("Are you sure you want to reset to the default recommended sequence?")){

        localStorage.removeItem("savedSequence");

        loadSequence();
    }
}

// param index will indicate which semester we're shifting down from
function shiftAllDownFromSemester(index){
    generateSequenceObject(function(sequenceObject){
        var semesterList = sequenceObject.semesterList;
        var season = indexToSeason(index);
        var emptySemester = {
            "season": season,
            "courseList" : [],
            "isWorkTerm": true
        };
        // insert the empty/work semester at the correct semester, pushing all the next ones forwards
        semesterList.splice(index,0,emptySemester);
        // update the seasons of the subsequent semesters
        for(var i = index+1; i < semesterList.length; i++){
            if(semesterList[i].season.toUpperCase() === "FALL"){
                semesterList[i].season = "winter";
            }
            else if(semesterList[i].season.toUpperCase() === "WINTER"){
                semesterList[i].season = "summer";
            }
            else if(semesterList[i].season.toUpperCase() === "SUMMER"){
                semesterList[i].season = "fall";
            }
        }
        sequenceObject.semesterList = semesterList;
        localStorage.setItem("savedSequence", JSON.stringify(sequenceObject));
        loadSequence();
    });
}

function seasonTextToIndex(seasonText){
    var yearNumber = seasonText.charAt(seasonText.length-1);
    var seasonNumber = 0;
    if(seasonText.toUpperCase().indexOf("FALL") >= 0){
        seasonNumber = 0;
    }
    if(seasonText.toUpperCase().indexOf("WINTER") >= 0){
        seasonNumber = 1;
    }
    if(seasonText.toUpperCase().indexOf("SUMMER") >= 0){
        seasonNumber = 2;
    }
    return (yearNumber - 1) * 3 + seasonNumber;
}

function indexToSeason(index){
    switch(index%3){
        case 0:
            return "fall";
        case 1:
            return "winter";
        case 2:
            return "summer";
    }
}

/* Big ugly function which sets up all event listeners */
function initUI(){

    // add mini triangle thingy into collapse buttons
    $("button.toggle").html("&#x25B2");

    // add click event for collapse buttons
    $("button.toggle").off("click");
    $("button.toggle").click(function(){
        var $courses =  $(this).parent().parent().children(".courseContainer");

        // flip the triangle around when the button is clicked
        if($courses.is(":hidden")){
            $(this).html("&#x25B2");
        } else {
            $(this).html("&#x25BC");
        }

        // trigger jquery-ui event
        $courses.slideToggle();
    });

    // add click event for downward-shift buttons
    $(".shiftSemester").off("click");
    $(".shiftSemester").click(function(){
        if(confirm("Are you sure you want to shift your sequence downwards from this point?")){
            // get season text from semester container header (e.g. FALL 4)
            var seasonText = $(this).parent().find("div:first-of-type").text();
            // convert the season text into an index
            var indexOf = seasonTextToIndex(seasonText);
            // shift down all semesters from that index
            shiftAllDownFromSemester(indexOf);
        }
    });

    $("#classSearch").off("keyup");
    $("#classSearch").keyup(function(e){
        if(e.keyCode == 13){
            requestCourseInfo($("#classSearch").val());
        }
    });

    $("button.search").off("click");
    $("button.search").click(function(){
        requestCourseInfo($("#classSearch").val());
    });

    $(".exportButton").off("click");
    $(".exportButton").click(function(){
        exportSequence();
    });

    $(".defaultsButton").off("click");
    $(".defaultsButton").click(function(){
        resetToDefaultSequence();
    });

    $("div.course:not(.undraggable)").off("mousedown mouseup click");
    $("div.course:not(.undraggable)").mousedown(function(){
        $(this).addClass("grabbed");
    });
    $("div.course:not(.undraggable)").mouseup(function(){
        $(this).removeClass("grabbed");
    });
    $("div.course:not(.undraggable)").click(function(){
        var code = $(this).find(".left").html();

        if(code !== "-" && code !== ""){
            requestCourseInfo(code);
        }
    });

    var globalTimer;

    $(".semesterHeading").droppable({
        over: function(){
            var $courses = $(this).parent().children(".courseContainer");
            globalTimer = setTimeout(function(){
                if($courses.is(":hidden")){
                    $courses.slideToggle(200, function(){
                        $(".courseContainer").sortable("refresh");
                    });
                }
            }, 500);
        },
        out: function(){
            clearTimeout(globalTimer);
        }
        //add for drop: so it appends the dragging object to the current container
    });

    $(".courseContainer").sortable({
        connectWith: ".courseContainer",
        // change event gets called when an item is dragged into a new position (including its original position)
        change: function(event, ui){
            var centerText = $(ui.item).find(".center").text();
            var index = ui.placeholder.index();
            draggingItem = true;
        },
        // update event gets invoked when an item is dropped into a new position (excluding its original position)
        update: function(event, ui){
            if(draggingItem){
                fillWorkTerms();
                generateSequenceObject(function(sequenceObject){
                    localStorage.setItem("savedSequence", JSON.stringify(sequenceObject));
                    validateSequence(sequenceObject);
                    updateTotalCredits(sequenceObject);
                });
            }
            draggingItem = false;
        },
        // remove drag ability from rows with classname 'undraggable'
        cancel: ".undraggable"
    }).disableSelection();

}
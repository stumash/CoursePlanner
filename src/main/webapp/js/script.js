// constants
var NUMBER_OF_YEARS = 5;

var container;
var lastContainerIndex;
// variable used to ensure the sequence is only validated once every time the user drags a class into a new position
var draggingItem = false;

// to keep track of when the mouse is moving down
var isMouseMoveDown = false;
window.lastMouseDown = 0;
window.startMouseTop = 0;

// to keep track of whether the user is currently dragging a container over the last Container
var isInLastContainer = false;

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

            var sequenceObject = JSON.parse(this.responseText);
            localStorage.setItem("savedSequence", JSON.stringify(sequenceObject));

            if (sequenceHistory.length < 1) {
                addSequenceToSequenceHistory(sequenceObject);
            }

            addContainers(sequenceObject, function(){
                // fill page with default sequence
                populatePage(sequenceObject);
                validateSequence(sequenceObject);
                initUI();
                if (callback) {
                    callback();
                }
            });

        });
        oReq.open("GET", "http://138.197.6.26/courses/sequences/SOEN-General-Coop.json");
        oReq.send();
    } else {

        if (sequenceHistory.length < 1) {
            addSequenceToSequenceHistory(savedSequence);
        }

        addContainers(savedSequence, function(){
            // fill page with the saved sequence
            populatePage(savedSequence);
            validateSequence(savedSequence);
            initUI();
            if (callback) {
                callback();
            }
        });
    }
}

function addContainers(courseList, callback){
    // load the term template
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){

        var termTemplate = this.responseText;
        console.log("term template:\n" + termTemplate);
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
                    addCourseRow($courseContainer, "-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", electiveType + " Elective", "3", true);
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
                    // var electiveType = courseList.electiveType.toString();
                    totalCredits += 3; // for now let us assume that most (if not all) electives are worth 3 credits
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

/**
 * this function fills empty course containers with an undraggable work term row
 * and removes work term rows from course containers which contain both a work term and classes
 */
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
    console.log("verifying:\n" + JSON.stringify(sequenceObject));
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
        addSequenceToSequenceHistory(sequenceObject);
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

/**
 * Big ugly function which sets up all event listeners
 */
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

    document.addEventListener('keydown', function(event) {
        // 90 is ascii for 'Z'
        if (event.keyCode == 90 && event.ctrlKey) {
            if (event.shiftKey) {
                redoSequenceModification();
            } else {
                undoSequenceModification();
            }
        }
    });

    containers = $('.courseContainer');
    lastContainerIndex = containers.length - 1;

    $(".courseContainer").eq(lastContainerIndex).sortable({
        // out event is triggered when a sortable item is moved away from a sortable list.
        out: function(event) {
            var lastHeading = $('.semesterHeading').eq(lastContainerIndex);
            var lastHeadingRect = lastHeading.offset();
            var lastContainer = $('.courseContainer').eq(lastContainerIndex);
            var lastContainerRect = lastContainer.offset(); // offset gets absolute top and left position
            var bottomOfLastContainer = lastContainerRect.top + lastContainer.height();

            // console.log("out update");
            //
            // console.log("event.pageY = "+event.pageY);
            // console.log("lastContainerRect.top = "+lastContainerRect.top);
            // console.log("lastContainer.height() = "+lastContainer.height());
            // console.log("bottomOfLastContainer = top + height() = "+bottomOfLastContainer);
            // console.log("lastHeadingRect.top = "+lastHeadingRect.top);
            // console.log("if (event.pageY >= lastHeadingRect.top && event.pageY < bottomOfLastContainer");
            // console.log("if ("+event.pageY+" >= "+lastHeadingRect.top+" && "+event.pageY+" < "+bottomOfLastContainer);

            if (event.pageY >= lastHeadingRect.top && event.pageY < bottomOfLastContainer) {
                isInLastContainer = true;
            } else {
                isInLastContainer = false;
            }

            updateIsMouseMoveDown(event);
        }
    });

    $(".courseContainer").sortable({
        connectWith: ".courseContainer",
        // change event gets called when an item is dragged into a new position (including its original position)
        change: function(event, ui) {
            //console.log("change event");
            var centerText = $(ui.item).find(".center").text();
            var index = ui.placeholder.index();
            draggingItem = true;

            var lastHeading = $('.semesterHeading').eq(lastContainerIndex);
            var lastHeadingRect = lastHeading.offset();
            var lastContainer = $('.courseContainer').eq(lastContainerIndex);
            var lastContainerRect = lastContainer.offset(); // offset gets absolute top and left position
            var bottomOfLastContainer = lastContainerRect.top + lastContainer.height();

            // console.log("change update");
            //
            // console.log("event.pageY = "+event.pageY);
            // console.log("lastContainerRect.top = "+lastContainerRect.top);
            // console.log("lastContainer.height() = "+lastContainer.height());
            // console.log("bottomOfLastContainer = top + height() = "+bottomOfLastContainer);
            // console.log("lastHeadingRect.top = "+lastHeadingRect.top);
            // console.log("if (event.pageY >= lastHeadingRect.top && event.pageY < bottomOfLastContainer");
            // console.log("if ("+event.pageY+" >= "+lastHeadingRect.top+" && "+event.pageY+" < "+bottomOfLastContainer);

            if (event.pageY >= lastHeadingRect.top && event.pageY < bottomOfLastContainer) {
                isInLastContainer = true;
            } else {
                isInLastContainer = false;
            }

            updateIsMouseMoveDown(event);

            console.log("draggingItem = "+draggingItem+", inLastContainer = "+isInLastContainer+", isMouseMoveDown = "+isMouseMoveDown);
        },
        // update event gets invoked when an item is dropped into a new position (excluding its original position)
        update: function(event, ui) {
            if (draggingItem) {
                fillWorkTerms();
                generateSequenceObject(function(sequenceObject){
                    localStorage.setItem("savedSequence", JSON.stringify(sequenceObject));
                    addSequenceToSequenceHistory(sequenceObject);
                    validateSequence(sequenceObject);
                    updateTotalCredits(sequenceObject);
                });
            }
            draggingItem = false;

            updateIsMouseMoveDown(event);
        },
        // stop event is triggered when sorting has stopped
        stop: function(event) {
            draggingItem = false; // to account for when user drags but does not change position of course

            updateIsMouseMoveDown(event);
        },
        // remove drag ability from rows with classname 'undraggable'
        cancel: ".undraggable"
    }).disableSelection();

    // I wrote onmouseover which is not a jquery function, instead of mouseover. The deploy script did not catch this error. So we must only be checking vanilla JS
    // @TODO is it possible if we have it account for actual jquery linting during deployment?
    $('.sequenceContainer').mouseover( function(event) {
        // if not for this then after adding an extra semester draggin item would stay true all the time and display hint would show up while hovering over any term
        draggingItem = false;
        // containers = $('.courseContainer');
        // lastContainerIndex = containers.length - 1;
        console.log("draggingItem = "+draggingItem+", inLastContainer = "+isInLastContainer+", isMouseMoveDown = "+isMouseMoveDown);

        updateIsMouseMoveDown(event);

    });

    $('.courseContainer').on( 'mousemove', function(event) {
        if (draggingItem && isInLastContainer) {
            // display tip
            console.log("DID YOU KNOW: You can easily add a new semester by dragging a class below this term");
        }
    });

    $(document).keypress(function(e) {
        if(e.which == 13) {
            console.log('You pressed enter!');
            // add new semester
            // console.log("ADDING NEW SEMESTER!");
            var sequenceObject = JSON.parse(localStorage.getItem("savedSequence"));

            // make changes to sequence object
            console.log("sequenceObject: \n" + JSON.stringify(sequenceObject));

            var newEmptySemester = {"season":"winter","courseList":[],"isWorkTerm":true};

            sequenceObject.semesterList.push(newEmptySemester);

            // update local storage variable
            localStorage.setItem("savedSequence", JSON.stringify(sequenceObject));

            // add to sequence history
            console.log("Updated sequenceObject:\n" + JSON.stringify(sequenceObject));

            addSequenceToSequenceHistory(sequenceObject);
            // reload the page
            loadSequence();
        }
    });

    $('.courseContainer').on( 'mouseleave' ,function(event) { // unbinds event after binding as opposed to the method directly above
        var lastContainer = $('.courseContainer').eq(lastContainerIndex);
        var lastContainerRect = lastContainer.offset(); // offset gets absolute top and left position
        var bottomOfLastContainer = lastContainerRect.top + lastContainer.height();

        if( isMouseMoveDown && draggingItem && event.pageY > bottomOfLastContainer) {
            lastContainerIndex++;

            // add new semester
            // console.log("ADDING NEW SEMESTER!");
            var sequenceObject = JSON.parse(localStorage.getItem("savedSequence"));

            // make changes to sequence object
            console.log("sequenceObject: \n" + JSON.stringify(sequenceObject));

            // @TODO chose the correct next following season.
            var newEmptySemester = {"season":"winter","courseList":[],"isWorkTerm":true};

            sequenceObject.semesterList.push(newEmptySemester);

            // update local storage variable
            localStorage.setItem("savedSequence", JSON.stringify(sequenceObject));

            // add to sequence history
            console.log("Updated sequenceObject:\n" + JSON.stringify(sequenceObject));

            addSequenceToSequenceHistory(sequenceObject);
            // reload the page
            loadSequence(function() {
                $(window).scrollTop($(document).height() - $(window).height());
            });
        }
    });

    var globalTimer;

    $(".semesterHeading").droppable({
        over: function() {
            var $courses = $(this).parent().children(".courseContainer");
            globalTimer = setTimeout(function(){
                if($courses.is(":hidden")){
                    $courses.slideToggle(200, function(){
                        $(".courseContainer").sortable("refresh");
                    });
                }
            }, 500);
        },
        out: function() {
            clearTimeout(globalTimer);
        }
    });
}

// must be called inside a handler function so that you can pass it an event object
function updateIsMouseMoveDown(event) {
    window.startMouseTop = event.pageY;

    if (window.startMouseTop > window.lastMouseTop){
        isMouseMoveDown = true;
    } else {
        isMouseMoveDown = false;
    }
    window.lastMouseTop = window.startMouseTop;
}

var sequenceHistory = [];
var sequenceVersionIndex = 0;
var sequenceHistoryMaxSize = 200;
// The array sequenceHistory holds up to the last 200 versions of the course sequence json.
// Every time the user alters the course sequence, a new version is saved in the array.  The user will
// then be able to go backwards and forwards in version history using <C-z> and <C-y> keystrokes.

// this function will add, upon modification by the user, the current version of the sequence to the
// sequenceHistory array.
function addSequenceToSequenceHistory(sequenceObject) {
    if (sequenceVersionIndex < sequenceHistory.length) {
        sequenceHistory[sequenceVersionIndex] = sequenceObject;
        sequenceVersionIndex++;
        sequenceHistory = sequenceHistory.slice(0,sequenceVersionIndex);
    } else {
        if (sequenceVersionIndex < sequenceHistoryMaxSize) {
            sequenceHistory[sequenceVersionIndex] = sequenceObject;
            sequenceVersionIndex++;
        } else {
            sequenceHistory.shift();
            sequenceHistory[sequenceVersionIndex] = sequenceObject;
        }
    }
}

// this function will let the user go back to the version of the sequence before the most recent
// sequence modification.  The user will be able to use the key combination <C-z> to use this feature.
function undoSequenceModification() {
    if (sequenceVersionIndex > 1) {
        sequenceVersionIndex--;
        localStorage.setItem("savedSequence", JSON.stringify(sequenceHistory[sequenceVersionIndex - 1]));
        loadSequence();
    }
}

// this function will let the user go forwards in history to the version of the sequence before the
// most recent <C-z> command.  The user will be able to use the key combination <C-S-z> to use this feature.
function redoSequenceModification() {
    if (sequenceVersionIndex < sequenceHistory.length) {
        localStorage.setItem("savedSequence", JSON.stringify(sequenceHistory[sequenceVersionIndex]));
        loadSequence();
        sequenceVersionIndex++;
    }
}

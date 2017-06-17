/* When the user clicks on the button, 
move to next page */
function myFunction() {
   localStorage.setItem("sequenceType", $("#SequenceType").val());
   // localStorage.setItem("EntrySemester", $("#Semester").val());
   // localStorage.setItem("Program", $("#Program").val());
   // localStorage.setItem("IsInCoop", $("#checkbox > input").prop('checked'));
   window.location.assign("sequenceBuilder.html");
}

function loadSequenceFileNames(){
	var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){

    	var fileNameArray = JSON.parse(this.responseText);
        var $listBox = $("#SequenceType");

        for(var i = 0; i < fileNameArray.length; i++){
        	$listBox.append("<option value=\"" + fileNameArray[i] + "\">" + fileNameArray[i] + "</option>");
        }
    });
    oReq.open("GET", "http://138.197.6.26/courseplanner/mongosequencelist");
    oReq.send();
}

$( document ).ready(function() {
	$("#checkbox").on("click", function() {
		console.log( "We should now toggle the checkbox" );
		var status = $('#checkbox input').prop('checked');
		$('#checkbox input').prop('checked', !status);
	});
	$("#checkbox > input").on("click", function(e) { e.stopPropagation(); });
	loadSequenceFileNames();
});
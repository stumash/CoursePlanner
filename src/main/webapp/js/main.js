/* When the user clicks on the button, 
move to next page */
function myFunction() {
   localStorage.setItem("sequenceType", $("#SequenceType").val());
   // localStorage.setItem("EntrySemester", $("#Semester").val());
   // localStorage.setItem("Program", $("#Program").val());
   // localStorage.setItem("IsInCoop", $("#checkbox > input").prop('checked'));
   window.location.assign("sequenceBuilder.html");
}

$( document ).ready(function() {
	$("#checkbox").on("click", function() {
		console.log( "We should now toggle the checkbox" );
		var status = $('#checkbox input').prop('checked');
		$('#checkbox input').prop('checked', !status);
	});
	$("#checkbox > input").on("click", function(e) { e.stopPropagation(); });
});
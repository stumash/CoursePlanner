/* When the user clicks on the button, 
move to next page */
function myFunction() {
   window.globalCheckboxBooleanValue = $("#checkbox > input").prop('checked');
   console.log($("#Semester").val());
   console.log($("#Program").val());
   console.log($("#checkbox > input").prop('checked'));
   localStorage.setItem("Semester", $("#Semester").val());
   localStorage.setItem("Program", $("#Program").val());
   localStorage.setItem("checkbox", $("#checkbox > input").prop('checked'));
   window.location.assign("scheduleBuilder.html");
}

$( document ).ready(function() {
	$("#checkbox").on("click", function() {
		console.log( "We should now toggle the checkbox" );
		var status = $('#checkbox input').prop('checked');
		$('#checkbox input').prop('checked', !status);
	});
	$("#checkbox > input").on("click", function(e) { e.stopPropagation(); });
});
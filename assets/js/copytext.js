function copyText(event, id)
{
  	//stolen from w3schools
	/* Get the text field */
	var copyText = document.getElementById(id);

	/* Select the text field */
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/

	/* Copy the text inside the text field */
	document.execCommand("copy");
	notify(event, "Copied!")
}


var notifications = 0


function destroyNotification(id){
	console.log(id)
	document.getElementById(id).remove()
}

function notify(event, text){
	var id = notifications.toString();
	var x = event.clientX;
	var y = event.clientY;
	var style = `position: absolute; display:block; z-index: 15; left: ${x}px; top: ${y}px;`
	document.body.innerHTML += `<div style="${style}" class='notification' id="notify${id}">${text}</div>`;
	setTimeout(destroyNotification, 1800, `notify${id}`);
	notifications += 1;
}
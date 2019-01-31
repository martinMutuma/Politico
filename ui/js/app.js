function hide_element(hideId, showId = '') {
	var elem = document.getElementById(hideId);
	elem.style.display = 'None';
	if (showId != '') {
		document.getElementById(showId).style.display = 'block';

	}
}
var modal = null;

function modal_create(modalId = 'modal-Id') {

	modal = document.getElementById(modalId);
}

function modal_show(modalId = null, hideId=null) {
	
	if (modalId != null) {
		modal_create(modalId);
		modal.style.display = 'block';
	} 
	if (hideId != null) {
		modal_create(hideId);
		modal.style.display = 'none';
	}
}

function modal_hide(modalId = null, showId=null) {
	if (modalId != null) {
		modal_create(modalId);
		modal.style.display = 'none';
	
	}
	if (showId != null) {
		modal_create(showId);
		modal.style.display = 'block';
	}
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

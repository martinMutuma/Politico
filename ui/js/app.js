function hide_element(hideId, showId=''){
	var elem =  document.getElementById(hideId);
	elem.style.display='None';
	if (showId!=''){
		document.getElementById(showId).style.display='block';
	
	}
}
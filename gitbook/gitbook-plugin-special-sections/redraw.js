function redraw(item) {
	var show = 0;
	var type = $(item).data('type');
	$('.sws-checkbox[data-type=' + type + ']').each(function(i, el) {
		if ($(el).is(":checked")) {
			show = show + $(el).data('id');
		}
	});
	$('.sws-div[data-type=' + type + ']').hide();
	$('[data-id=' + show + '][data-type=' + type + ']').show();
}
function redraw(id) {
  var show = 0;
  $(`.sws-checkbox`).each(function(i, el) {
    if ($(el).is(':checked')) {
      show = show + $(el).data('id');
    }
  });
  $(`.panel-image-group`).hide();
  $(`.panel-image-group[data-id=${show}]`).show();
}

$('.panel').on('hide.bs.collapse', function (el) {
  $('#toggleangle' + el.target.id.replace('collapse', '')).removeClass('fa-angle-up').addClass('fa-angle-down');
});

$('.panel').on('show.bs.collapse', function (el) {
  $('#toggleangle' + el.target.id.replace('collapse', '')).removeClass('fa-angle-down').addClass('fa-angle-up');
});

$(document).ready(function() {
  redraw(0);
  new Clipboard('.clipboard-button');
});

gitbook.events.bind('page.change', function() {
  redraw(0);
});
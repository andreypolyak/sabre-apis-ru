$('.panel').on('hide.bs.collapse', (el) => {
  const id = '#toggleangle' + el.target.id.replace('collapse', '');
  $(id).removeClass('fa-angle-up').addClass('fa-angle-down');
});

$('.panel').on('show.bs.collapse', (el) => {
  const id = '#toggleangle' + el.target.id.replace('collapse', '');
  $(id).removeClass('fa-angle-down').addClass('fa-angle-up');
});

document.addEventListener("DOMContentLoaded", function(event) {
  anchors.add('h2, h3, h4, h5, h6');
});

$(document).ready(() => {
  redraw();
  new Clipboard('.clipboard-button');
});

gitbook.events.bind('page.change', () => {
  anchors.add('h2, h3, h4, h5, h6');
  redraw();
});

function redraw(id, category) {
  if (category) {
    $(`.panel-image-group`).each(function(i, el) {
      const cur_id = $(el).data('id').split('_')[1];
      const cur_category = $(el).data('id').split('_')[0];
      if (category == cur_category && id == cur_id) {
        $(el).show();
      } else if (category == cur_category && id != cur_id){
        $(el).hide();
      }
    });
  } else {
    $(`.panel-image-group`).each(function(i, el) {
      const cur_id = $(el).data('id').split('_')[1];
      if (cur_id == '0') {
        $(el).show();
      } else {
        $(el).hide();
      }
    });
  }
}

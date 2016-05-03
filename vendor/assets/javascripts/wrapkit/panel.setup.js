(function(){
  'use strict';

  // DEFINE VARIABLES
  // =====================================
  var WrapkitPanel = window.WrapkitPanel,
  panels = document.querySelectorAll('.content .panel');


  [].forEach.call(panels, function(panel){
    new WrapkitPanel( panel, panel.dataset );
  });

  // adding transition to panel events
  // Listening Events
  $('.panel').on('collapse', function(e, collapse){
    var $this = $(this),
    $el = $this.children('.panel-body, .panel-footer, .table, .list-group, .collapse-el');

    if (collapse) {
      $el.css('display', 'block');

      $el.velocity('slideUp', {
        duration: 250,
        begin: function(elements) {
          [].forEach.call(elements, function(el){
            if ($(el).is('table')) {
              $(el).css('display', 'table');
            }
          });
        }
      });
    } else{
      $el.css('display', 'none').velocity('slideDown', {
        duration: 250,
        begin: function(elements) {
          [].forEach.call(elements, function(el){
            if ($(el).is('table')) {
              $(el).css('opacity', 0);
            }
          });
        },
        complete: function(elements) {
          [].forEach.call(elements, function(el){
            if ($(el).is('table')) {
              $(el).css({
                display: 'table',
                opacity: 1
              });
            }
          });
        }
      });
    }
  }).on('expand', function(e, expand){
    var $el = $(this);

    $el.find('[data-toggle="tooltip"], [rel="tooltip"]').tooltip('hide');

    if (expand) {
      $el.velocity('transition.expandIn', 250);
    } else{
      $el.velocity.RunSequence([
        { e: $el, p: 'transition.expandOut', o: { duration: 250 } },
        { e: $el, p: 'transition.fadeIn', o: { duration: 300, sequenceQueue: false } },
        ]);
    }
  });


  // just demo
  // loader scenario
  $(panels).on('showLoader', function(e){
    var el = e.target;

    // remove manually loader component
    setTimeout(function(){
      $(el).removeClass('panel-onloading');
      $(el).find('.panel-title').removeClass('hide');
      $(el).find('.panel-loader').remove();
    }, 1000);
  });
})(window);
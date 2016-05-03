(function(){
  'use strict';

  // DEFINE VARIABLES
  // =====================================
  var WrapkitContent = window.WrapkitContent,
      toogleRtlBtn = document.querySelectorAll('[data-content="toggleRtl"]');


  // INITIALIZE WRAPKIT CONTENT
  // =====================================
  var opts = ($.cookie('template_setups')) ? $.parseJSON($.cookie( 'template_setups_content' )) : {};
  // make it global, so we can re-use it from other scopes
  window.wc = new WrapkitContent( '.content-wrapper', opts );


  // ADD EVENTS FOR INTERACTIONS
  // =====================================
  [].forEach.call(toogleRtlBtn, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      window.wc.rtl( !window.wc.options.rtlMode );
    });
  });


  // LISTEN WHEN USER FIRE AN EVENT
  // =====================================

})(window);
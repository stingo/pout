(function(){
  'use strict';

  // DEFINE VARIABLES
  // =====================================
  var WrapkitFooter = window.WrapkitFooter,
      toogleSkinBtn = document.querySelectorAll('[data-footer="toggleSkin"]'),
      toogleRtlBtn = document.querySelectorAll('[data-footer="toggleRtl"]');


  // INITIALIZE WRAPKIT FOOTER
  // =====================================
  var opts = ($.cookie('template_setups')) ? $.parseJSON($.cookie( 'template_setups_footer' )) : {};
  // make it global, so we can re-use it from other scopes
  window.wf = new WrapkitFooter( '.footer-wrapper', opts );


  // ADD EVENTS FOR INTERACTIONS
  // =====================================
  [].forEach.call(toogleSkinBtn, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      var skin = el.dataset.skin;
      window.wf.setSkin( skin );
    });
  });
  [].forEach.call(toogleRtlBtn, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      window.wf.rtl( !window.wf.options.rtlMode );
    });
  });

  // LISTEN WHEN USER FIRE AN EVENT
  // =====================================

})(window);
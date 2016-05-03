(function(){
  'use strict';

  // DEFINE VARIABLES
  // =====================================
  var WrapkitSidebar = window.WrapkitSidebar,
  WrapkitUtils   = window.WrapkitUtils,
  toggleVisible  = document.querySelectorAll('[data-sidebar="toggleVisible"]'),
  toggleResize   = document.querySelectorAll('[data-sidebar="toggleResize"]'),
  toggleCollapse = document.querySelectorAll('[data-sidebar="toggleCollapse"]'),
  toggleFixed    = document.querySelectorAll('[data-sidebar="toggleFixed"]'),
  toggleLoader   = document.querySelectorAll('[data-sidebar="toggleLoader"]'), // just for demo
  toggleAlign    = document.querySelectorAll('[data-sidebar="toggleAlign"]'),
  toggleRtl      = document.querySelectorAll('[data-sidebar="toggleRtl"]'),
  toggleSkin     = document.querySelectorAll('[data-sidebar="toggleSkin"]'),
  toggleVariant  = document.querySelectorAll('[data-sidebar="toggleVariant"]'),
  toggleContext  = document.querySelectorAll('[data-sidebar="toggleContext"]');


  // INITIALIZE WRAPKIT SIDEBAR
  // =====================================
  var opts = ($.cookie('template_setups')) ? $.parseJSON($.cookie( 'template_setups_sidebar' )) : { mode: 'vertical', skin: 'dark', context: 'teal' };
  // make it global, so we can re-use it from other scopes
  window.sidebar = new WrapkitSidebar( '.sidebar',  opts);


  // ADD EVENTS FOR INTERACTIONS
  // =====================================
  [].forEach.call(toggleVisible, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      if (window.sidebar.options.visible){
        window.sidebar.hide();
      }
      else{
        window.sidebar.show();
      }
    });
  });
  [].forEach.call(toggleResize, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      window.sidebar.resizable(!window.sidebar.options.resizable);
    });
  });
  [].forEach.call(toggleCollapse, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      var cs = (window.sidebar.options.size === 'lg') ? 'sm' : 'lg';
      window.sidebar.size( cs );
    });
  });
  [].forEach.call(toggleFixed, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      window.sidebar.fixed( !window.sidebar.options.fixed );
    });
  });
  [].forEach.call(toggleLoader, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      window.sidebar.showLoader(2);

      setTimeout( function(){
        window.sidebar.hideLoader(2);
      }, 3000);
    });
  });
  [].forEach.call(toggleAlign, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      var align = (window.sidebar.options.align === 'left') ? 'right' : 'left';

      window.sidebar.align(align);
    });
  });
  [].forEach.call(toggleRtl, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      window.sidebar.rtl(!window.sidebar.options.rtlMode);
    });
  });
  [].forEach.call(toggleSkin, function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();

      var skin = this.dataset.skin;
      window.sidebar.setSkin(skin);
    });
  });
  [].forEach.call(toggleVariant, function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();

      var variant = this.dataset.variant;
      window.sidebar.setVariant(variant);
    });
  });
  [].forEach.call(toggleContext, function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();

      var context = this.dataset.context;
      window.sidebar.setContext(context);
    });
  });


  // LISTEN WHEN USER FIRE AN EVENT
  // =====================================
  window.sidebar.on( '_expand', function( obj, node ){
    var $target = $(node.querySelector('.nav-child'));
    $.Velocity.RunSequence([
      { e: $target, p: 'transition.fadeIn', o: { duration: 250 } },
      { e: $target.children('li'), p: 'transition.slideUpIn', o: { stagger: 35, sequenceQueue: false } }
      ]);
  })
  .on( '_collapse', function( obj, node ){
    var $target = $(node.querySelectorAll('.nav-child'));
    $target.velocity('transition.fadeOut', { duration: 250 });
  })
  .on( 'align', function( obj, align ){
    if (align === 'left') {
      obj.$elem.velocity('transition.slideLeftIn', { duration: 250 });
    } else{
      obj.$elem.velocity('transition.slideRightIn', { duration: 250 });
    }
  })
  .on( 'setMode', function(obj, mode){
    var wrapper = obj.$elem.find('.nav-wrapper');
    if ( mode === 'vertical' ) {
      if (obj.options.fixed) {
        WrapkitUtils.initSlimScroll(wrapper);
      } else{
        WrapkitUtils.destroySlimScroll(wrapper);
        wrapper.css('height', '');
      }
    } else{
      if( WrapkitUtils.viewport().width < 768 && obj.options.fixed ){
        WrapkitUtils.initSlimScroll(wrapper);
      } else{
        WrapkitUtils.destroySlimScroll(wrapper);
        wrapper.css('height', '');
      }
    }
  })
  .on( 'sticky', function(){
    var wrapper = window.sidebar.$elem.find('.nav-wrapper');

    if (wrapper.parent().hasClass('slimScrollDiv')) {
      setTimeout(function(){
        var height = wrapper.css('height');
        wrapper.parent().css('height', height);
      }, 250);
    }
  })
  .on( 'fixed', function(obj, fixed){
    var wrapper = obj.$elem.find('.nav-wrapper');

    if ( obj.options.mode === 'vertical' || (WrapkitUtils.viewport().width < 768 && obj.options.mode === 'horizontal') ) {
      if (fixed) {
        WrapkitUtils.initSlimScroll(wrapper);
      } else{
        WrapkitUtils.destroySlimScroll(wrapper);
      }
    }
  });
  window.addEventListener('resize', WrapkitUtils.debounce(function(){
    var wrapper = window.sidebar.$elem.find('.nav-wrapper');

    if ( window.sidebar.options.mode === 'vertical' ) {
      if (window.sidebar.options.fixed) {
        WrapkitUtils.initSlimScroll(wrapper);
      } else{
        WrapkitUtils.destroySlimScroll(wrapper);
        wrapper.css('height', '');
      }
    } else{
      if( WrapkitUtils.viewport().width < 768 && window.sidebar.options.fixed ){
        WrapkitUtils.initSlimScroll(wrapper);
      } else{
        WrapkitUtils.destroySlimScroll(wrapper);
        wrapper.css('height', '');
      }
    }
  }, 100));
})(window);
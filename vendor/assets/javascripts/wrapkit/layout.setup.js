(function(){
  'use strict';

  // DEFINE VARIABLES
  // =====================================
  var WrapkitLayout = window.WrapkitLayout,
  WrapkitUtils = window.WrapkitUtils,
  classie = window.classie,
  header = document.querySelector('.header'),
  sidebar = document.querySelector('.sidebar'),
  content = document.querySelector('.content-wrapper'),
  toogleBoxBtn = document.querySelectorAll('[data-layout="toggleBox"]'),
  toogleBoxFs = document.querySelectorAll('[data-layout="toggleFs"]');


  // INITIALIZE WRAPKIT LAYOUT
  // =====================================
  var opts = ($.cookie('template_setups')) ? $.parseJSON($.cookie( 'template_setups_layout' )) : {};
  // make it global, so we can re-use it from other scopes
  window.wl = new WrapkitLayout( '.wrapkit-wrapper', opts );

  // including bg settings
  if ($.cookie( 'template_bg' )) {
    document.body.dataset.bg = $.cookie( 'template_bg' );
    classie.add(document.body, 'bg-grd-' + $.cookie( 'template_bg' ) );
  } else{
    // default gradient bg
    document.body.dataset.bg = 'dark';
    classie.add(document.body, 'bg-grd-dark' );
  }


  // ADD EVENTS FOR INTERACTIONS
  // =====================================
  [].forEach.call(toogleBoxBtn, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      if (window.wl.options.box) {
        window.wl.setFluid();
      } else{
        window.wl.setBox();
      }
    });
  });
  [].forEach.call(toogleBoxFs, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();

      if (window.wl.options.fullscreen) {
        window.wl.exitFullscreen();
      } else{
        window.wl.fullscreen();
      }
    });
  });


  // Tricky: sincronize sidebar and content when using fixed position on box layout
  // This is required if you use sidebar fixed on layout box
  var boxSticky = function(){
    var sidebarRight = (window.sidebar.options.align === 'right');
    if (window.scrollY > WrapkitUtils.offsets(sidebar).top) {
      if (window.sidebar.options.mode === 'horizontal') {
        sidebar.style.right = WrapkitUtils.offsets(content).left + 'px';
        sidebar.style.left = WrapkitUtils.offsets(content).left + 'px';
      } else{
        if ( sidebarRight ) {
          sidebar.style.right = WrapkitUtils.offsets(content).left + 'px';
          sidebar.style.left = '';
        } else{
          sidebar.style.right = '';
          sidebar.style.left = WrapkitUtils.offsets(content).left + 'px';
        }
      }
    } else{
      if (window.sidebar.options.mode === 'horizontal') {
        if (window.wh.options.fixed) {
          sidebar.style.right = WrapkitUtils.offsets(content).left + 'px';
          sidebar.style.left = WrapkitUtils.offsets(content).left + 'px';
        } else{
          sidebar.style.right = '';
          sidebar.style.left = '';
        }
      } else{
        if ( sidebarRight ) {
          if(window.wh.options.fixed){
            sidebar.style.right = WrapkitUtils.offsets(content).left + 'px';
          } else{
            sidebar.style.right = '';
          }
          sidebar.style.left = '';
        } else{
          if(window.wh.options.fixed){
            sidebar.style.left = WrapkitUtils.offsets(content).left + 'px';
          } else{
            sidebar.style.left = '';
          }
          sidebar.style.right = '';
        }
      }
    }
  },
  boxFixedSidebar = function(s, h, c, box){
    var sidebarFixed = window.sidebar.options.fixed;
    window.removeEventListener( 'scroll', boxSticky );

    if ( box && sidebarFixed && (WrapkitUtils.viewport().width > 767) ) {
      // sidebar position
      boxSticky();
      window.addEventListener( 'scroll', boxSticky );
    } else{
      s.style.right = '';
      s.style.left = '';
    }

    headerFixedBoxHandler();
  },
  headerFixedBoxHandler = function(){
    if ( window.wl.options.box && window.wh.options.fixed && (WrapkitUtils.viewport().width > 767) ) {
      window.wh.elem.style.right = WrapkitUtils.offsets(content).left + 'px';
      window.wh.elem.style.left = WrapkitUtils.offsets(content).left + 'px';
    } else if( (window.wl.options.box && window.wh.options.fixed && (WrapkitUtils.viewport().width <= 767)) ||
      (window.wl.options.box && !window.wh.options.fixed) ||
      (!window.wl.options.box) ){
      window.wh.elem.style.right = '';
      window.wh.elem.style.left = '';
    }
  },
  sidebarFixedBoxHandler = function(){
    var box = window.wl.options.box;

    boxFixedSidebar(sidebar, header, content, box);
  };

  headerFixedBoxHandler();
  sidebarFixedBoxHandler();

  window.wl.on( 'layoutChanged', function(){
    sidebarFixedBoxHandler();
  });
  window.sidebar.on( 'fixed', sidebarFixedBoxHandler )
    .on( 'align', sidebarFixedBoxHandler )
    .on( 'setMode', sidebarFixedBoxHandler );
  window.wh.on( 'fixed', function(){
    headerFixedBoxHandler();
    sidebarFixedBoxHandler();
  });

  window.addEventListener( 'resize', function(){
    headerFixedBoxHandler();
    sidebarFixedBoxHandler();
  });

})(window);
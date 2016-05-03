(function(){
  'use strict';

  // DEFINE VARIABLES
  // =====================================
  var WrapkitHeader  = window.WrapkitHeader,
  toogleSkinBtn  = document.querySelectorAll('[data-header="toggleSkin"]'),
  toogleFixedBtn = document.querySelectorAll('[data-header="toggleFixed"]'),
  toogleRtlBtn   = document.querySelectorAll('[data-header="toggleRtl"]');

  // INITIALIZE WRAPKIT HEADER
  // =====================================
  var opts = ($.cookie('template_setups')) ? $.parseJSON($.cookie( 'template_setups_header' )) : {};
  // make it global, so we can re-use it from other scopes
  window.wh = new WrapkitHeader( '.header', opts );


  // ADD EVENTS FOR INTERACTIONS
  // =====================================
  [].forEach.call(toogleSkinBtn, function(el){
    // default
    var skin = el.dataset.skin;
    el.addEventListener( 'click', function(e){
      e.preventDefault();
      window.wh.setSkin( skin );
    });
  });
  [].forEach.call(toogleFixedBtn, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();
      var bottom = (el.dataset.position && el.dataset.position === 'bottom');
      if (bottom) {
        window.wh.fixedBottom();
      } else{
        window.wh.fixedTop();
      }
    });
  });
  [].forEach.call(toogleRtlBtn, function(el){
    el.addEventListener( 'click', function(e){
      e.preventDefault();
      window.wh.rtl( !window.wh.options.rtlMode );
    });
  });


  // LISTEN WHEN USER FIRE AN EVENT
  // =====================================
  // default logo
  var baseUriAsset = 'images/logo/',
  logo = document.querySelector('.logo'),
  whSkin = window.wh.options.skin;
  if(whSkin === 'inverse'){
    logo.setAttribute('src', baseUriAsset + 'brand-text-light.png');
  } else{
    logo.setAttribute('src', baseUriAsset + 'brand-text-dark.png');
  }
  window.wh.on('setSkin', function(el, old, cur){
    if(cur === 'inverse'){
      logo.setAttribute('src', baseUriAsset + 'brand-text-light.png');
    } else{
      logo.setAttribute('src', baseUriAsset + 'brand-text-dark.png');
    }
  })
  .on('fixedTop', function(el){
    var $el = el.$elem;

    $el.find('.dropup').toggleClass('dropup dropdown');
  })
  .on('fixedBottom', function(el){
    var $el = el.$elem;

    $el.find('.dropdown').toggleClass('dropdown dropup');
  })
  .on('rtl', function(el){
    var $el = el.$elem,
    r = $el.find('.navbar-right'),
    l = $el.find('.navbar-left'),
    dr = $el.find('.dropdown-menu-right'),
    dl = $el.find('.dropdown-menu-left');

    r.toggleClass('navbar-right navbar-left');
    l.toggleClass('navbar-left navbar-right');
    dr.toggleClass('dropdown-menu-left dropdown-menu-right');
    dl.toggleClass('dropdown-menu-right dropdown-menu-left');
  });


  // CUSTOM SEARCH FORM
  // =====================================
  $('#brandSearchNav').on( 'click', function(e){
    e.preventDefault();

    $('#brandSearchFrm').velocity('transition.expandIn', { duration: 250 });
  });
  $('.search-close').on( 'click', function(){
    $('#brandSearchFrm').velocity('reverse', {display: 'none'});
  });
  // end of wrapkit header setup

})(window);
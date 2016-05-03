/*!
 * WrapkitUtils v1.1
 * Exclusive component control
 * author - Bent
 * from Stilearning
 *
 *
 * Dependencies:
 * classie
 *
 *
 * Notes: we are re-write this code using vanilla js on v1.1
 */

 /*jshint browser: true, strict: true, undef: true, unused: true */
 /*global define: false, module: false */
 ( function( window ) {
  'use strict';

  // short vars
  var document = window.document;


  // noop fn
  var noop = function(){};

  // extend objects
  var extend = function( a, b ) {
    for ( var prop in b ) {
      a[ prop ] = b[ prop ];
    }
    return a;
  };

  // turn element or nodeList into an array
  var makeArray = function( obj ) {
    var arr = [];
    if ( Array.isArray(obj) ) {
      // use object if already an array
      arr = obj;
    } else if ( typeof obj.length === 'number' ) {
      // convert nodeList to array
      for ( var i=0, len = obj.length; i < len; i++ ) {
        arr.push( obj[i] );
      }
    } else {
      // array of single index
      arr.push( obj );
    }
    return arr;
  };

  // trigger jQuery event
  var jqEmiter = function( $elem, type, args){
    if ( $ ) {
      $elem.trigger( type, args );
    }
  };

  // Detect Device ( Mobile or Desktop )
  var isMobile = function(){
    return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? true : false;
  };

  // detect real viewport
  var viewport = function(){
    var vp = {
      width: Math.max( document.documentElement.clientWidth, window.innerWidth || 0 ),
      height: Math.max( document.documentElement.clientHeight, window.innerHeight || 0 )
    };
    return vp;
  };

  // Retrieve the position (x,y) of an element
  var offsets = function( el ){
    el = ( typeof el === 'string' ) ? document.querySelector(el) : el;
    var rect = el.getBoundingClientRect(),
    offsets = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left
    };
    return offsets;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate){
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow){
        func.apply(context, args);
      }
    };
  };

  // get height
  var getHeight = function(el) {
    el = ( typeof el === 'string') ? document.querySelector(el) : el;
    return Math.max( el.scrollHeight, el.offsetHeight, el.clientHeight );
  };

  // get width
  var getWidth = function(el) {
    el = ( typeof el === 'string') ? document.querySelector(el) : el;
    return Math.max( el.scrollWidth, el.offsetWidth, el.clientWidth );
  };

  // get document height
  var getDocHeight = function() {
    return Math.max( getHeight(document.body), getHeight(document.documentElement) );
  };

  // get document width
  var getDocWidth = function() {
    return Math.max( getWidth(document.body), getWidth(document.documentElement) );
  };

  // Create an script, usefull for http request
  var createScript = function( src ){
    var script = document.createElement( 'script' );

    script.className = 're-execute';
    script.type = 'text/javascript';
    script.src = src;

    // remove the same existing script
    var old = document.querySelectorAll('script[src="' + src + '"]');
    if (old.length) {
      [].forEach.call(old, function(el){
        document.body.removeChild(el);
      });
    }
    // reload re-execute scripts (this may register script to re-axecute scripts)
    document.body.appendChild(script);
  };

  // use slimScroll on any $elem
  var initSlimScroll = function( $el, h ) {
    var _this = this,
    height = h || $el.css('height'),
    data = $el.data();

    data = $.extend( data, {height: height} );

    // only initialized on large device
    if (!_this.isMobile()){
      $el.slimScroll(data);
    }
  };

  // use slimScroll on any elem
  var destroySlimScroll = function( $el ) {
    var _this = this;

    if (!_this.isMobile()){
      $el.slimScroll({
        'destroy': true
      });
      // manually remove bar and rail
      setTimeout(function(){
        var wrapper = $el.parent();
        wrapper.children('.slimScrollRail').remove();
        wrapper.children('.slimScrollBar').remove();
        $el.css({
          overflow: '',
          width: ''
        });
      }, 250);
    }
  };

  // matches a CSS selector by traversing up the DOM tree
  var closest = function(el, selector){
    var ELEMENT = Element.prototype;
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

    while (el) {
      if (el.matches(selector)) {
        break;
      }

      el = el.parentElement;
    }
    return el;
  };

  // Listen the end of css transition of an element
  var transitionEnd = function(el){
    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd otransitionend',
      'transition'       : 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return transEndEventNames[name];
      }
    }
  };


  // =============================================================
  // MAIN FUNCTIONS
  // =============================================================
  var WrapkitUtils = {
    noop: noop,
    extend: extend,
    makeArray: makeArray,
    jqEmiter: jqEmiter,
    isMobile: isMobile,
    viewport: viewport,
    offsets: offsets,
    debounce: debounce,
    getHeight: getHeight,
    getWidth: getWidth,
    getDocHeight: getDocHeight,
    getDocWidth: getDocWidth,
    createScript: createScript,
    initSlimScroll: initSlimScroll,
    destroySlimScroll: destroySlimScroll,
    closest: closest,
    transitionEnd: transitionEnd
  };

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( WrapkitUtils );
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = WrapkitUtils;
  } else {
    // browser global
    window.WrapkitUtils = WrapkitUtils;
  }

})( window );
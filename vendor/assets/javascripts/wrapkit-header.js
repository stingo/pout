/*!
 * WrapkitHeader v1.1
 * Exclusive component control
 * author - Bent
 * from Stilearning
 *
 *
 * Dependencies:
 * classie
 * EventEmitter
 *
 *
 * Using Vanilla JS:
 * var wh = new WrapkitHeader( selector, options, callback )
 * methods
 * wh.setSkin( skinName ) -> available wrapkit navbar contexts
 * wh.fixed( boolean ) -> enable/disable header fixed
 * wh.fixedTop() -> set header fixed to top
 * wh.fixedBottom() -> set header fixed to bottom
 * wh.rtl() -> enable/disable right to left direction on header
 *
 *
 * Using jQuery:
 * Note: required jQuery bridget (https://github.com/desandro/jquery-bridget)
 * $( selector ).wrapkitHeader(options, callback)
 * methods
 * $( selector ).wrapkitHeader( methodName, args... )
 * example:
 * $( '.header' ).wrapkitHeader( 'setSkin', 'inverse' )
 *
 *
 * Notes: we are re-write this code using vanilla js on v1.1 (not required jquery)
 */

 /*jshint browser: true, strict: true, undef: true, unused: true */
 /*global define: false, module: false */
 ( function( window, factory ) { 'use strict';

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [
      'classie/classie',
      'eventEmitter/EventEmitter'
      ],
      function( classie, EventEmitter ) {
        return factory( window, classie, EventEmitter );
      });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('desandro-classie'),
      require('wolfy87-eventemitter')
      );
  } else {
    // browser global
    window.WrapkitHeader = factory(
      window,
      window.classie,
      window.EventEmitter,
      window.WrapkitUtils
      );
  }

})( window, function factory(window, classie, EventEmitter, WrapkitUtils){
  'use strict';

  // short vars
  var document = window.document,
  body = document.body,
  $ = window.jQuery;


  // =============================================================
  // MAIN FUNCTIONS
  // =============================================================

  /**
   * define WrapkitHeader
   * @param {String, Element, NodeList, Array}   element
   * @param {Object}                             options
   * @param {Function}                           callback
   */
   function WrapkitHeader( elem, opts, cb){
    // coerce WrapkitHeader() without new, to be new WrapkitHeader()
    if ( !( this instanceof WrapkitHeader ) ) {
      return new WrapkitHeader( elem, opts );
    }

    // querySelector if string
    this.elem = document.querySelector( elem );

    // support jQuery
    if ( $ ) {
      this.$elem = $( this.elem );
    }

    // define options
    this.options = {
      skin: 'default',
      fixed: false,
      fixedPosition: 'top',
      rtlMode: false,
      prefixClass: 'navbar-'
    };

    // extend options or call cb
    if ( typeof opts === 'function' ) {
      // use options as a callback
      cb = opts;
    } else{
      // set options by user
      this.option( opts );
    }

    // default initialize
    this._init();

    // callback
    if (cb){
      cb(this.elem, this.options);
    }
    else{
      WrapkitUtils.noop();
    }
  }


  // attach EventEmitter to triggers an event
  WrapkitHeader.prototype = new EventEmitter();

  /**
   * initialize
   */
   WrapkitHeader.prototype._init = function(){
    var _this = this;

    // if init before
    if (_this.elem.dataset.initHeader) {
      _this.option( _this.elem.dataset );
      return;
    }

    // set skin
    _this.setSkin(_this.options.skin );
    // set position
    _this.fixed(_this.options.fixed );
    // set direction
    _this.rtl(_this.options.rtlMode );

    _this.elem.dataset.initHeader = true;

    // trigger init
    // Hack - Chrome triggers event
    setTimeout( function() {
      _this.emit('init', _this);
      // emit event jquery
      WrapkitUtils.jqEmiter(_this.$elem, 'init', _this.options);
    });
  };

  WrapkitHeader.data = function() {
    return this.options;
  };

  /**
   * set options
   * @param {Object} opts
   */
   WrapkitHeader.prototype.option = function( opts ) {
    var _this = this;

    WrapkitUtils.extend( _this.options, opts );

    // trigger when option is change
    _this.emit('option', _this, opts);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'option', opts);
  };

  /**
   * Public method setSkin
   * @param {String} skin
   */
   WrapkitHeader.prototype.setSkin = function( skin ) {
    var _this = this,
    old = _this.options.skin,
    current = skin;

    // remove active skin
    classie.remove( _this.elem, _this.options.prefixClass + old );
    // add current skin
    classie.add( _this.elem, _this.options.prefixClass + current );

    // update options
    _this.options.skin = current;

    // trigger when skin changed
    _this.emit('setSkin', _this, old, current);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'setSkin', [old, current]);
  };

  /**
   * Public method setFixed
   * @param {Boolean} position
   */
   WrapkitHeader.prototype.fixed = function( pos ) {
    var _this = this;
    // set position
    if(pos){
      classie.add( _this.elem, 'navbar-fixed-' + _this.options.fixedPosition );
      classie.add( body, 'wrapkit-header-fixed-' + _this.options.fixedPosition );

      // if sidebar fixed before
      if (classie.has( body, 'wrapkit-sidebar-fixed' )) {
        classie.remove(body.querySelector('.sidebar'), 'sidebar-sticky');
      }
    } else{
      classie.remove( _this.elem, 'navbar-fixed-' + _this.options.fixedPosition );
      classie.remove( body, 'wrapkit-header-fixed-' + _this.options.fixedPosition );

      // if sidebar fixed before
      if (classie.has( body, 'wrapkit-sidebar-fixed' )) {
        if (window.scrollY >= 50) {
          classie.add(body.querySelector('.sidebar'), 'sidebar-sticky');
        } else{
          classie.remove(body.querySelector('.sidebar'), 'sidebar-sticky');
        }
      }
    }

    // update options
    _this.options.fixed = pos;

    // trigger when fixed changed
    _this.emit('fixed', _this, pos);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'fixed', pos);
  };

  /**
   * Public method fixedTop
   */
   WrapkitHeader.prototype.fixedTop = function() {
    var _this = this;

    // set header fixed to top
    classie.remove( _this.elem, 'navbar-fixed-top' );
    classie.remove( _this.elem, 'navbar-fixed-bottom' );
    classie.add( _this.elem, 'navbar-fixed-top' );

    // set body class
    classie.remove( body, 'wrapkit-header-fixed-top' );
    classie.remove( body, 'wrapkit-header-fixed-bottom' );
    classie.add( body, 'wrapkit-header-fixed-top' );

    // update options
    _this.options.fixedPosition = 'top';

    // trigger when fixed to top
    _this.emit('fixedTop', _this);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'fixedTop');
  };

  /**
   * Public method fixedBottom
   */
   WrapkitHeader.prototype.fixedBottom = function() {
    var _this = this;

    // set header fixed to bottom
    classie.remove( _this.elem, 'navbar-fixed-top' );
    classie.remove( _this.elem, 'navbar-fixed-bottom' );
    classie.add( _this.elem, 'navbar-fixed-bottom' );

    // set body class
    classie.remove( body, 'wrapkit-header-fixed-top' );
    classie.remove( body, 'wrapkit-header-fixed-bottom' );
    classie.add( body, 'wrapkit-header-fixed-bottom' );

    // update options
    _this.options.fixedPosition = 'bottom';

    // trigger when fixed to bottom
    _this.emit('fixedBottom', _this);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'fixedBottom');
  };

  /**
   * Public method rtl
   * @return {Boolean} rtl
   */
   WrapkitHeader.prototype.rtl = function(rtl) {
    var _this = this;
    // set body class
    if (rtl) {
      classie.add( body, 'wrapkit-header-rtl' );
    } else{
      classie.remove( body, 'wrapkit-header-rtl' );
    }
    // update options
    _this.options.rtlMode = rtl;

    // trigger when direction changed
    _this.emit('rtl', _this);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'rtl');
  };


  // =============================================================
  // jQuery bridget
  // =============================================================
  if ( $ && $.bridget ) {
    $.bridget( 'wrapkitHeader', WrapkitHeader );
  }



  // =============================================================
  // RETURN
  // =============================================================

  return WrapkitHeader;
});
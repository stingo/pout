/*!
 * WrapkitLayout v1.1
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
 *
 * Notes: we are re-write this code using vanilla js on v1.1 (not required jquery)
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */
(function( window, factory ){ 'use strict';

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
      require('wolfy87-eventemitter'),
      require('screenfull')
    );
  } else {
    // browser global
    window.WrapkitLayout = factory(
      window,
      window.classie,
      window.EventEmitter,
      window.WrapkitUtils,
      window.screenfull
    );
  }

})( window, function factory(window, classie, EventEmitter, WrapkitUtils, screenfull){
  'use strict';

  // short vars
  var document = window.document,
      body = document.body,
      $ = window.jQuery;


  // =============================================================
  // MAIN FUNCTIONS
  // =============================================================
  /**
   * define WrapkitLayout
   * @param {String, Element, NodeList, Array}   element
   * @param {Object}                             options
   * @param {Function}                           callback
   */
  function WrapkitLayout( elem, opts, cb){
    // coerce WrapkitLayout() without new, to be new WrapkitLayout()
    if ( !( this instanceof WrapkitLayout ) ) {
      return new WrapkitLayout( elem, opts );
    }

    // querySelector if string
    this.elem = document.querySelector( elem );

    // support jQuery
    if ( $ ) {
      this.$elem = $( this.elem );
    }

    // define options
    this.options = {
      box: false,
      fullscreen: false
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
  WrapkitLayout.prototype = new EventEmitter();

  /**
   * initialize
   */
  WrapkitLayout.prototype._init = function(){
    var _this = this;

    // if init before
    if (_this.elem.dataset.initLayout) {
      _this.option( _this.elem.dataset );
      return;
    }

    // public
    _this._box(_this.options.box);
    // couse request fs not working onload
    if (_this.options.fullscreen) {
      _this.options.fullscreen = false;
    }

    _this.elem.dataset.initLayout = true;

    // trigger init
    // Hack - Chrome triggers event
    setTimeout( function() {
      _this.emit('init', _this);
      // emit event jquery
      WrapkitUtils.jqEmiter(_this.$elem, 'init', _this.options);
    });
  };

  /**
   * set options
   * @param {Object} opts
   */
  WrapkitLayout.prototype.option = function( opts ) {
    var _this = this;

    WrapkitUtils.extend( _this.options, opts );

    // trigger when option is change
    _this.emit('option', _this, opts);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'option', opts);
  };


  /**
   * Public method _box
   * @return {Boolean} box
   */
  WrapkitLayout.prototype._box = function(box) {
    var _this = this;
    // set body class
    if (box) {
      classie.add( body, 'wrapkit-layout-box' );
      classie.add( _this.elem, 'container' );
    } else{
      classie.remove( body, 'wrapkit-layout-box' );
      classie.remove( _this.elem, 'container' );
    }

    // update options
    _this.options.box = box;

    // trigger when direction changed
    _this.emit('layoutChanged', _this, box);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'layoutChanged', box);
  };


  /**
   * Public method _fs
   * @return {Boolean} fs
   */
  WrapkitLayout.prototype._fs = function(fullscreen) {
    var _this = this;

    if (screenfull.enabled){
      if ( fullscreen ) {
        screenfull.request();
      } else{
        screenfull.exit();
      }

      // update options
      _this.options.fullscreen = fullscreen;

      // trigger when direction changed
      _this.emit('fullscreen', _this, fullscreen);
      // emit event jquery
      WrapkitUtils.jqEmiter(_this.$elem, 'fullscreen', fullscreen);
    } else{
      window.alert( 'Your Browser does not support Fullscreen!' );
      return false;
    }
  };


  /**
   * Public method setBox
   * @return
   */
  WrapkitLayout.prototype.setBox = function() {
    this._box(true);
  };


  /**
   * Public method setFluid
   * @return
   */
  WrapkitLayout.prototype.setFluid = function() {
    this._box(false);
  };


  /**
   * Public method fullscreen
   * @return
   */
  WrapkitLayout.prototype.fullscreen = function() {
    this._fs(true);
  };


  /**
   * Public method exitFullscreen
   * @return
   */
  WrapkitLayout.prototype.exitFullscreen = function() {
    this._fs(false);
  };



  // =============================================================
  // jQuery bridget
  // =============================================================
  if ( $ && $.bridget ) {
    $.bridget( 'wrapkitLayout', WrapkitLayout );
  }


  // =============================================================
  // RETURN
  // =============================================================
  return WrapkitLayout;
});
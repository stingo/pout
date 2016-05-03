/*!
 * WrapkitFooter v1.1
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
      require('wolfy87-eventemitter')
    );
  } else {
    // browser global
    window.WrapkitFooter = factory(
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
   * define WrapkitFooter
   * @param {String, Element, NodeList, Array}   element
   * @param {Object}                             options
   * @param {Function}                           callback
   */
  function WrapkitFooter( elem, opts, cb){
    // coerce WrapkitFooter() without new, to be new WrapkitFooter()
    if ( !( this instanceof WrapkitFooter ) ) {
      return new WrapkitFooter( elem, opts );
    }

    // querySelector if string
    this.elem = document.querySelector( elem );

    // support jQuery
    if ( $ ) {
      this.$elem = $( this.elem );
    }

    // define options
    this.options = {
      prefixClass: 'footer-',
      skin: 'default',
      rtlMode: false
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
  WrapkitFooter.prototype = new EventEmitter();

  /**
   * initialize
   */
  WrapkitFooter.prototype._init = function(){
    var _this = this;

    // if init before
    if (_this.elem.dataset.initFooter) {
      _this.option( _this.elem.dataset );
      return;
    }

    // public
    _this.setSkin(_this.options.skin);
    _this.rtl(_this.options.rtlMode);

    _this.elem.dataset.initFooter = true;

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
  WrapkitFooter.prototype.option = function( opts ) {
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
  WrapkitFooter.prototype.setSkin = function( skin ) {
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
   * Public method rtl
   * @return {Boolean} rtl
   */
  WrapkitFooter.prototype.rtl = function(rtl) {
    var _this = this;
    // set body class
    if (rtl) {
      classie.add( body, 'wrapkit-footer-rtl' );
    } else{
      classie.remove( body, 'wrapkit-footer-rtl' );
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
    $.bridget( 'wrapkitFooter', WrapkitFooter );
  }


  // =============================================================
  // RETURN
  // =============================================================
  return WrapkitFooter;
});
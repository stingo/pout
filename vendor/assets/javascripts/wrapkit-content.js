/*!
 * WrapkitContent v1.1
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
    window.WrapkitContent = factory(
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
   * define WrapkitContent
   * @param {String, Element, NodeList, Array}   element
   * @param {Object}                             options
   * @param {Function}                           callback
   */
   function WrapkitContent( elem, opts, cb){
    // coerce WrapkitContent() without new, to be new WrapkitContent()
    if ( !( this instanceof WrapkitContent ) ) {
      return new WrapkitContent( elem, opts );
    }

    // querySelector if string
    this.elem = document.querySelector( elem );

    // support jQuery
    if ( $ ) {
      this.$elem = $( this.elem );
    }

    // define options
    this.options = {
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
  WrapkitContent.prototype = new EventEmitter();

  /**
   * initialize
   */
   WrapkitContent.prototype._init = function(){
    var _this = this;

    // if init before
    if (_this.elem.dataset.initContent) {
      _this.option( _this.elem.dataset );
      return;
    }

    // public
    _this.rtl(_this.options.rtlMode);

    _this.elem.dataset.initContent = true;

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
   WrapkitContent.prototype.option = function( opts ) {
    var _this = this;

    WrapkitUtils.extend( _this.options, opts );

    // trigger when option is change
    _this.emit('option', _this, opts);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'option', opts);
  };


  /**
   * Public method rtl
   * @return {Boolean} rtl
   */
   WrapkitContent.prototype.rtl = function(rtl) {
    var _this = this;
    // set body class
    if (rtl) {
      classie.add( body, 'wrapkit-content-rtl' );
    } else{
      classie.remove( body, 'wrapkit-content-rtl' );
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
    $.bridget( 'wrapkitContent', WrapkitContent );
  }


  // =============================================================
  // RETURN
  // =============================================================
  return WrapkitContent;
});
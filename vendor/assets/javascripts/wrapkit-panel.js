/*!
 * WrapkitPanel v1.1
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
    window.WrapkitPanel = factory(
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
   * define WrapkitPanel
   * @param {String, Element, NodeList, Array}   element
   * @param {Object}                             options
   * @param {Function}                           callback
   */
   function WrapkitPanel( elem, opts, cb){
    // coerce WrapkitPanel() without new, to be new WrapkitPanel()
    if ( !( this instanceof WrapkitPanel ) ) {
      return new WrapkitPanel( elem, opts );
    }

    // querySelector if string
    this.elem = (typeof elem === 'string') ? document.querySelector( elem ) : elem;

    // support jQuery
    if ( $ ) {
      this.$elem = $( elem );
    }

    // define options
    this.options = {
      collapse: false,
      expand: false,
      loaderTemplate: '<i class="fa fa-spin fa-spinner"></i>',
      context: 'default',
      loaderColor: 'blue',
      fillColor: false
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
  WrapkitPanel.prototype = new EventEmitter();

  /**
   * initialize
   */
  WrapkitPanel.prototype._init = function(){
    var _this = this;

    // if init before
    if (_this.elem.dataset.initPanel) {
      _this.option( _this.elem.dataset );
      return;
    }

    // prepare classes show/hide elem
    classie.add(_this.elem, 'fade');
    classie.add(_this.elem, 'in');

    // default
    _this.collapse(_this.options.collapse);
    _this.expand(_this.options.expand);
    _this.setContext(_this.options.context);

    // controll
    var collapseBtn = _this.elem.querySelectorAll('[data-toggle="panel-collapse"]'),
    hideBtn = _this.elem.querySelectorAll('[data-toggle="panel-hide"]'),
    expandBtn = _this.elem.querySelectorAll('[data-toggle="panel-expand"]'),
    contextBtn = _this.elem.querySelectorAll('[data-toggle="panel-context"]'),
    fillBtn = _this.elem.querySelectorAll('[data-toggle="panel-fill"]'),
    refreshBtn = _this.elem.querySelectorAll('[data-toggle="panel-refresh"]');

    [].forEach.call( collapseBtn ,function(el){
      el.addEventListener( 'click', function(e){
        e.preventDefault();

        _this.collapse(!_this.options.collapse);
      });
    });
    [].forEach.call( hideBtn ,function(el){
      el.addEventListener( 'click', function(e){
        e.preventDefault();

        _this.hide();
      });
    });
    [].forEach.call( expandBtn ,function(el){
      el.addEventListener( 'click', function(e){
        e.preventDefault();
        var i;

        _this.expand(!_this.options.expand);

        if (_this.options.expand) {
          i = this.querySelector('.arrow_expand');
          if (i !== null) {
            classie.add(i, 'arrow_condense');
            classie.remove(i, 'arrow_expand');
          }
        } else{
          i = this.querySelector('.arrow_condense');
          if (i !== null) {
            classie.remove(i, 'arrow_condense');
            classie.add(i, 'arrow_expand');
          }
        }

        // open collapse on expand
        if (_this.options.collapse) {
          _this.collapse(false);
        }
      });
    });
    [].forEach.call( contextBtn ,function(el){

      el.addEventListener( 'click', function(e){
        e.preventDefault();

        var data = el.dataset,
        context = data.context || 'default',
        fill = data.fill === 'true' || false;

        _this.setContext(context);
        _this.setFill(fill);
      });
    });
    [].forEach.call( fillBtn ,function(el){

      el.addEventListener( 'click', function(e){
        e.preventDefault();
        var data = el.dataset,
        fill = data.fill || false;

        _this.setFill(fill);
      });

      el.addEventListener( 'change', function(e){
        e.preventDefault();
        var checked = el.checked;

        _this.setFill(checked);
      });
    });
    [].forEach.call( refreshBtn ,function(el){
      el.addEventListener( 'click', function(e){
        e.preventDefault();

        _this.showLoader();
      });
    });

    _this.elem.dataset.initPanel = true;

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
  WrapkitPanel.prototype.option = function( opts ) {
    var _this = this;

    WrapkitUtils.extend( _this.options, opts );

    // trigger when option is change
    _this.emit('option', _this, opts);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'option', opts);
  };


  /**
   * Public method setContext
   * @return {String} context
   */
  WrapkitPanel.prototype.setContext = function(context) {
    var _this = this,
    old = _this.options.context,
    curr = context;

    // remove prev context
    if (classie.has(_this.elem, 'panel-' + old)) {
      classie.remove(_this.elem, 'panel-' + old);
    }
    // remove new context
    classie.add(_this.elem, 'panel-' + curr);
    // looking for fill options and update it
    _this.setFill(_this.options.fillColor);

    // update options
    _this.options.context = context;

    // trigger when direction changed
    _this.emit('setContext', _this, context);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'setContext', context);
  };


  /**
   * Public method toggleFill
   * @return {String} toggleFill
   */
  WrapkitPanel.prototype.setFill = function(fill) {
    var _this = this;

    var args = (fill === 'true' || fill === true);

    if (args) {
      classie.add(_this.elem, 'panel-fill');
    } else{
      classie.remove(_this.elem, 'panel-fill');
    }

    // update options
    _this.options.fillColor = args;

    // trigger when direction changed
    _this.emit('toggleFill', _this, args);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'toggleFill', args);
  };


  /**
   * Public method hide
   * @return {Boolean} hide
   */
  WrapkitPanel.prototype.hide = function() {
    var _this = this;

    classie.remove(_this.elem, 'in');

    var transitionEvent = WrapkitUtils.transitionEnd(_this.elem);

    if (_this.options.expand) {
      body.style.overflow = '';
      _this.elem.removeAttribute('style');
    }
    _this.elem.addEventListener( transitionEvent, function(){
      classie.add(_this.elem, 'hide');
    });


    // trigger when direction changed
    _this.emit('hide', _this);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'hide');
  };


  /**
   * Public method collapse
   * @return {Boolean} collapse
   */
  WrapkitPanel.prototype.collapse = function(collapse) {
    var _this = this;

    if (collapse) {
      classie.add(_this.elem, 'panel-collapsed');
    } else{
      classie.remove(_this.elem, 'panel-collapsed');
    }

    // update options
    _this.options.collapse = collapse;

    // trigger when direction changed
    _this.emit('collapse', _this, collapse);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'collapse', collapse);
  };


  /**
   * Public method expand
   * @return {Boolean} expand
   */
  WrapkitPanel.prototype.expand = function(expand) {
    var _this = this;

    if (expand) {
      classie.add(_this.elem, 'panel-expanded');
      body.style.overflow = 'hidden';
    } else{
      classie.remove(_this.elem, 'panel-expanded');
      body.style.overflow = '';
    }

    // update options
    _this.options.expand = expand;

    // trigger when direction changed
    _this.emit('expand', _this, expand);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'expand', expand);
  };


  /**
   * Public method showLoader
   * @return {Boolean} showLoader
   */
  WrapkitPanel.prototype.showLoader = function() {
    var _this = this,
    heading = _this.elem.querySelector('.panel-heading'),
    title = _this.elem.querySelector('.panel-title'),
    loaderContainer = document.createElement('div'),
    loader = document.createElement('div'),
    loaderInner = document.createElement('div');

    if (classie.has(_this.elem, 'panel-onloading')) {
      return;
    }

    classie.add(loaderContainer, 'panel-loader');
    classie.add(loader, 'loader-inner');
    classie.add(loader, 'ball-clip-rotate');
    classie.add(loaderInner, 'border-' + _this.options.loaderColor);

    loaderInner.style.cssText = 'border-bottom-color:transparent !important;width:20px;height:20px;border-radius:10px;';

    loader.appendChild(loaderInner);
    loaderContainer.appendChild(loader);
    heading.appendChild(loaderContainer);

    classie.add(title, 'hide');
    classie.add(_this.elem, 'panel-onloading');

    // trigger when direction changed
    _this.emit('showLoader', _this);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'showLoader');
  };


  // =============================================================
  // jQuery bridget
  // =============================================================
  if ( $ && $.bridget ) {
    $.bridget( 'wrapkitPanel', WrapkitPanel );
  }


  // =============================================================
  // RETURN
  // =============================================================
  return WrapkitPanel;
});
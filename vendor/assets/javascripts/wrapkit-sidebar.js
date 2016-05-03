/*!
 * WrapkitSidebar v1.1
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
    window.WrapkitSidebar = factory(
      window,
      window.classie,
      window.EventEmitter,
      window.interact,
      window.WrapkitUtils
      );
  }

})( window, function factory(window, classie, EventEmitter, interact, WrapkitUtils){
  'use strict';

  // short vars
  var document = window.document,
  body = document.body,
  $ = window.jQuery;


  // =============================================================
  // MAIN FUNCTIONS
  // =============================================================
  /**
   * define WrapkitSidebar
   * @param {String, Element, NodeList, Array}   element
   * @param {Object}                             options
   * @param {Function}                           callback
   */
   function WrapkitSidebar( elem, opts, cb){
    // coerce WrapkitSidebar() without new, to be new WrapkitSidebar()
    if ( !( this instanceof WrapkitSidebar ) ) {
      return new WrapkitSidebar( elem, opts );
    }

    // querySelector if string
    this.elem = document.querySelector( elem );

    // support jQuery
    if ( $ ) {
      this.$elem = $( this.elem );
    }

    // define options
    this.options = {
      mode: 'vertical',
      visible: true,
      skin: 'default',
      context: 'blue',
      variant: 'tabs',
      fixed: false,
      align: 'left',
      rtlMode: false,
      size: 'lg',
      resizable: true,
      maxResize: 360,
      minResize: 220,
      caret: {
        prefix: 'fa',
        collapse: 'fa-angle-right',
        expand: 'fa-angle-down'
      },
      loader: 'fa-spinner'
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
  WrapkitSidebar.prototype = new EventEmitter();

  /**
   * initialize
   */
   WrapkitSidebar.prototype._init = function(){
    var _this = this;

    // if init before
    if (_this.elem.dataset.initSidebar) {
      _this.option( _this.elem.dataset );
      return;
    }

    // private
    _this._createCaret();
    _this._toggleChild();
    _this._visibility(_this.options.visible);

    // public
    _this.resize();
    _this.align(_this.options.align);
    _this.rtl(_this.options.rtlMode);
    _this.size(_this.options.size);
    _this.setContext( _this.options.context );
    _this.setSkin( _this.options.skin );
    _this.setVariant( _this.options.variant );
    _this.fixed( _this.options.fixed );
    _this.setMode(_this.options.mode);

    // update layout height
    _this._updateLayoutHeight();

    // default hide on mobile device
    if ( WrapkitUtils.viewport().width < 768 && _this.options.visible ) {
      _this.hide();
    }
    if ( WrapkitUtils.viewport().width >= 768 && _this.options.mode === 'horizontal' && !_this.options.visible ) {
      _this.show();
    }
    // normalize depend elem styles
    var contentWrapper = document.querySelector('.content-wrapper'),
    footerWrapper = document.querySelector('.footer-wrapper');
    window.addEventListener( 'resize', WrapkitUtils.debounce(function(){

      // then updating caret and horizontal component
      _this._updateCaret();
      // _this.updateHorizontalControl();

      if( WrapkitUtils.viewport().width < 768 ){
        if (contentWrapper) {
          contentWrapper.style.paddingLeft = '';
          contentWrapper.style.paddingRight = '';
        }
        if (footerWrapper) {
          footerWrapper.style.paddingLeft = '';
          footerWrapper.style.paddingRight = '';
        }
      }

      // for horizontal menu
      if (_this.options.mode === 'horizontal' && WrapkitUtils.viewport().width >= 768) {
        var wrapper = _this.elem.querySelector('.nav-wrapper'),
        nav = wrapper.querySelector('.nav'),
        fakePadding = wrapper.querySelector('.nav-fake-padding'),
        translate = (getComputedStyle(nav).marginLeft) ? parseInt(getComputedStyle(nav).marginLeft) : 0,
        wrapperWidth = wrapper.offsetWidth,
        navWidth = WrapkitUtils.getWidth(nav),
        maxTranslate = navWidth - wrapperWidth,
        menus = _this.elem.querySelectorAll('.nav-item'),
        lastMenu = menus[menus.length - 1],
        lastOffset = WrapkitUtils.offsets(lastMenu).right + WrapkitUtils.getWidth(lastMenu),
        emptySpace = navWidth - lastOffset,
        inc = (classie.has(body, 'wrapkit-layout-box')) ? (maxTranslate - emptySpace - WrapkitUtils.offsets(wrapper).left) : (maxTranslate - emptySpace);

        // convert translate to positif value
        translate = Math.abs(translate);

        // fixed translate position on horizontal mode
        if ( translate >= maxTranslate ) {
          translate = translate + Math.round(inc) + 5;
          console.log(translate);

          nav.style.marginLeft = '-'+ translate +'px';
          if (translate > 0) {
            fakePadding.style.boxShadow = '5px 0px 5px 0px rgba(22, 24, 27, 0.156863)';
          } else{
            fakePadding.style.boxShadow = '';
          }
        }

        // collapse open menus
        var openMenu = _this.elem.querySelectorAll('li.open');
        [].forEach.call(openMenu, function(menu){
          _this._collapse(menu);
        });
      }
    }, 250));

    _this.elem.dataset.initSidebar = true;

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
   WrapkitSidebar.prototype.option = function( opts ) {
    var _this = this;

    WrapkitUtils.extend( _this.options, opts );

    // trigger when option is change
    _this.emit('option', _this, opts);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'option', opts);
  };

  /**
   * Private method _updateLayoutHeight
   * cause we can't predict the layout height every sidebar have a new height
   * so we need to update layout component with new doc height
   */
   WrapkitSidebar.prototype._updateLayoutHeight = function(){
    var _this = this,
    wrapper = document.querySelector('.wrapkit-wrapper'),
    content = document.querySelector('.content-wrapper');

    // calculate the current hight when element is ready (wait until transition done)
    setTimeout(function(){
      wrapper.style.minHeight = '';
      content.style.minHeight = '';

      var originalHeight = _this.elem.offsetHeight,
      expandHeight = WrapkitUtils.getHeight(_this.elem),
      isExpand = (expandHeight > originalHeight);

      // pending for transition first then call it
      if ( !_this.options.fixed && _this.options.mode === 'vertical' ) {
        if ( isExpand ) {
          wrapper.style.minHeight = expandHeight + 'px';
          content.style.minHeight = expandHeight + 'px';
        } else{
          wrapper.style.minHeight = '';
          content.style.minHeight = '';
        }
      }
    }, 250);
  };

  /**
   * Private method expand menu child
   * @return {[type]} [description]
   */
   WrapkitSidebar.prototype._expand = function( node ){
    var _this = this;

    classie.add( node, 'open');
    // toggle caret
    if ( _this.options.mode === 'vertical' || (WrapkitUtils.viewport().width < 768 && _this.options.mode === 'horizontal') ) {
      classie.remove( node.querySelector('.nav-caret'), _this.options.caret.collapse );
      classie.add( node.querySelector('.nav-caret'), _this.options.caret.expand );
    }

    // update layout height
    _this._updateLayoutHeight();

    // trigger when option is change
    _this.emit('_expand', _this, node);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, '_expand', node);
  };

  /**
   * Private method collapse menu child
   * @return {[type]} [description]
   */
   WrapkitSidebar.prototype._collapse = function( node ){
    var _this = this,
    nodeChild = node.querySelectorAll('.nav-child');

    classie.remove( node, 'open');
    // toggle caret

    // use timeout couse we wait until rendering caret finished
    setTimeout(function(){
      if ( _this.options.mode === 'vertical' || (WrapkitUtils.viewport().width < 768 && _this.options.mode === 'horizontal') ) {
        classie.remove( node.querySelector('.nav-caret'), _this.options.caret.expand );
        classie.add( node.querySelector('.nav-caret'), _this.options.caret.collapse );
      }

      // also collapse child
      [].forEach.call( nodeChild, function(el){
        classie.remove( el.parentNode, 'open' );
        // toggle caret
        if ( _this.options.mode === 'vertical' || (WrapkitUtils.viewport().width < 768 && _this.options.mode === 'horizontal') ) {
          classie.remove( el.previousElementSibling.querySelector('.nav-caret'), _this.options.caret.expand );
          classie.add( el.previousElementSibling.querySelector('.nav-caret'), _this.options.caret.collapse );
        }
      });
    }, 0);

    // update layout height
    _this._updateLayoutHeight();

    // trigger when option is change
    _this.emit('_collapse', _this, node);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, '_collapse', node);
  };

  /**
   * Public method toggleChild menu
   * @return {[type]} [description]
   */
   WrapkitSidebar.prototype._toggleChild = function(){
    var _this = this,
    target = _this.elem.querySelectorAll('[data-toggle="nav-child"]');

    [].forEach.call(target, function( el ){
      var node = el.parentNode;

      el.addEventListener( 'click', function(e){
        e.preventDefault();
        e.stopPropagation();

        if (_this.options.mode === 'horizontal' && WrapkitUtils.viewport().width >= 768 && classie.has(node, 'nav-item') && !classie.has(node, 'open') ) {
          var openMenu = _this.elem.querySelectorAll('li.open');

          [].forEach.call(openMenu, function(menu){
            _this._collapse(menu);
          });
        }

        if ( classie.has( node, 'open') ) {
          _this._collapse(node);
        } else{
          var openNav = _this.elem.querySelector('.open');

          if ( openNav && _this.options.size === 'sm' && classie.has(node, 'nav-item') ) {
            _this._collapse(openNav);
          }
          _this._expand(node);
        }
      });

      el.addEventListener( 'keyup', function(e){
        e.preventDefault();

        if ( e.keyCode === 27 ) {
          _this._collapse(node);
        }
      });

      body.addEventListener( 'click', function(){
        if ( _this.options.size === 'sm' || (WrapkitUtils.viewport().width >= 768 && _this.options.mode === 'horizontal') ) {
          _this._collapse(node);
        }
      });
    });
  };

  /**
   * Public method createCaret
   */
   WrapkitSidebar.prototype._createCaret = function(){
    var _this = this,
    target = _this.elem.querySelectorAll('[data-toggle="nav-child"]'),
    horizontalCaret = 'fa-angle-down';

    [].forEach.call(target, function( el ){
      var parent = el.parentNode,
      i = document.createElement('i');

      classie.add( i, 'nav-caret' );
      classie.add( i, 'pull-right' );
      classie.add( i, _this.options.caret.prefix );
      if (_this.options.mode === 'vertical') {
        if(classie.has(parent, 'open')){
          classie.add( i, _this.options.caret.expand );
        } else{
          classie.add( i, _this.options.caret.collapse );
        }
      } else{
        if(classie.has(parent, 'nav-item')){
          if(WrapkitUtils.viewport().width >= 768){
            classie.add( i, horizontalCaret );
          } else{
            if(classie.has(parent, 'open')){
              classie.add( i, _this.options.caret.expand );
            } else{
              classie.add( i, _this.options.caret.collapse );
            }
          }
        } else{
          if(WrapkitUtils.viewport().width >= 768){
            classie.add( i, _this.options.caret.collapse );
          } else{
            if(classie.has(parent, 'open')){
              classie.add( i, _this.options.caret.expand );
            } else{
              classie.add( i, _this.options.caret.collapse );
            }
          }
        }
      }
      el.insertBefore( i, el.firstChild);
    });
  };

  /**
   * Public method updateCaret
   */
   WrapkitSidebar.prototype._updateCaret = function(){
    var _this = this,
    carets = _this.elem.querySelectorAll('.nav-caret');

    [].forEach.call(carets, function( caret ){
      caret.parentNode.removeChild(caret);
    });
    setTimeout(function(){
      _this._createCaret();
    }, 0);
   };

  /**
   * Private method _visibility
   */
   WrapkitSidebar.prototype._visibility = function( visible ){
    var _this = this;

    if ( visible ) {
      _this.show();
    } else{
      _this.hide();
    }
  };

  /**
   * Public method show
   */
   WrapkitSidebar.prototype.show = function(){
    var _this = this,
    backdrop = document.createElement('div');

    classie.add( backdrop, 'sidebar-backdrop' );

    body.appendChild(backdrop);

    backdrop.addEventListener( 'click', function(){
      _this.hide();
    });

    if (classie.has( body, 'wrapkit-sidebar-hide' )){
      classie.remove( body, 'wrapkit-sidebar-hide' );
    }

    // helper for layout box
    if (classie.has(body, 'wrapkit-layout-box')) {
      classie.add( body, 'push-content-front' );

      setTimeout(function(){
        classie.remove( body, 'push-content-front' );
      }, 500);
    }

    // update options
    _this.options.visible = true;

    // trigger when show
    _this.emit('show', _this, true);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'show', true);
  };

  /**
   * Public method hide
   */
   WrapkitSidebar.prototype.hide = function(){
    var _this = this,
    backdrop = body.querySelector('.sidebar-backdrop'),
    contentWrapper = document.querySelector('.content-wrapper'),
    footerWrapper = document.querySelector('.footer-wrapper');

    if (backdrop !== null) {
      body.removeChild(backdrop);
    }

    if (contentWrapper) {
      contentWrapper.style.paddingLeft = '';
      contentWrapper.style.paddingRight = '';
    }
    if (footerWrapper) {
      footerWrapper.style.paddingLeft = '';
      footerWrapper.style.paddingRight = '';
    }

    classie.add( body, 'wrapkit-sidebar-hide' );

    // helper for layout box
    if (classie.has(body, 'wrapkit-layout-box')) {
      classie.add( body, 'push-content-front' );

      setTimeout(function(){
        classie.remove( body, 'push-content-front' );
      }, 500);
    } else{
      if (! _this.options.fixed) {
        _this.elem.setAttribute('style', '');
      }
    }

    // update options
    _this.options.visible = false;

    // trigger when hide
    _this.emit('hide', _this, false);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'hide', false);
  };


  /**
   * Public method horizontalControl
   */
  WrapkitSidebar.prototype.horizontalControl = function() {
    var _this = this;

    // create nav controll when menu is too long
    // prepare ctrl templates
    var wrapper = _this.elem.querySelector('.nav-wrapper'),
    nav = wrapper.querySelector('.nav'),
    navCtrl = document.createElement('div'),
    fakePadding = document.createElement('div'),
    ctrlLeft = document.createElement('a'),
    ctrlRight = document.createElement('a'),
    arrowLeft = document.createElement('span'),
    arrowRight = document.createElement('span');

    // adding classes
    classie.add( navCtrl, 'nav-ctrl' );
    classie.add( navCtrl, 'btn-group' );
    classie.add( fakePadding, 'nav-fake-padding' );
    classie.add( fakePadding, 'bg-' + _this.options.skin );
    // ctrl left
    classie.add( ctrlLeft, 'btn' );
    classie.add( ctrlLeft, 'hover-' + _this.options.context );
    classie.add( ctrlLeft, 'btn-icon' );
    classie.add( ctrlLeft, 'btn-xs' );
    // ctrl right
    classie.add( ctrlRight, 'btn' );
    classie.add( ctrlRight, 'hover-' + _this.options.context );
    classie.add( ctrlRight, 'btn-icon' );
    classie.add( ctrlRight, 'btn-xs' );
    // arrow left
    classie.add( arrowLeft, 'icon-arrow-left' );
    // arrow right
    classie.add( arrowRight, 'icon-arrow-right' );

    // append icon to ctrl
    ctrlLeft.appendChild(arrowLeft);
    ctrlRight.appendChild(arrowRight);
    // append ctrl to ctrl wrapper
    navCtrl.appendChild(ctrlLeft);
    navCtrl.appendChild(ctrlRight);

    // append ctrl to nav wrapper
    wrapper.appendChild(navCtrl);
    wrapper.appendChild(fakePadding);

    // adding style
    // but, wait until transition done
    setTimeout(function(){
      if (WrapkitUtils.getWidth(nav) > wrapper.offsetWidth) {
        classie.remove( navCtrl, 'hide' );
        classie.remove( fakePadding, 'hide' );
        // add shadow
        wrapper.style.boxShadow = 'inset -10px 0 5px -5px rgba(22, 24, 27, 0.16)';
      } else{
        classie.add( navCtrl, 'hide' );
        classie.add( fakePadding, 'hide' );
        // remove shadow
        wrapper.style.boxShadow = '';
      }
    }, 250);

    // attach events
    var translate = 0,
    incTranslate = 200;
    ctrlRight.addEventListener( 'click', function(){
      var wrapperWidth = wrapper.offsetWidth,
      navWidth = WrapkitUtils.getWidth(nav),
      maxTranslate = navWidth - wrapperWidth;

      translate = translate + incTranslate;
      translate = (translate > maxTranslate) ? maxTranslate : translate;

      nav.style.marginLeft = '-'+ translate +'px';
      if (translate > 0) {
        fakePadding.style.boxShadow = '5px 0px 5px 0px rgba(22, 24, 27, 0.156863)';
      } else{
        fakePadding.style.boxShadow = '';
      }
    });
    ctrlLeft.addEventListener( 'click', function(){
      var maxTranslate = 0;

      translate = (translate > maxTranslate) ? (translate - incTranslate) : maxTranslate;
      translate = (translate < maxTranslate ) ? maxTranslate : translate;

      nav.style.marginLeft = '-'+ translate +'px';
      if (translate > 0) {
        fakePadding.style.boxShadow = '5px 0px 5px 0px rgba(22, 24, 27, 0.156863)';
      } else{
        fakePadding.style.boxShadow = '';
      }
    });

    // update elements styles
    window.addEventListener( 'resize', WrapkitUtils.debounce(function(){
      if (_this.options.mode === 'horizontal') {
        if( WrapkitUtils.viewport().width < 768 ){
          classie.add( _this.elem.querySelector('.nav-wrapper .nav'), 'nav-stacked' );
          classie.add( navCtrl, 'hide' );
          classie.add( fakePadding, 'hide' );
          nav.style.marginLeft = '';
          wrapper.style.boxShadow = '';
          fakePadding.style.boxShadow = '';
        } else{
          classie.remove( _this.elem.querySelector('.nav-wrapper .nav'), 'nav-stacked' );
          if (!_this.options.visible) {
            _this.show();
          }
          if (WrapkitUtils.getWidth(nav) > wrapper.offsetWidth) {
            classie.remove( navCtrl, 'hide' );
            classie.remove( fakePadding, 'hide' );
            // add shadow
            wrapper.style.boxShadow = 'inset -10px 0 5px -5px rgba(22, 24, 27, 0.16)';
          } else{
            classie.add( navCtrl, 'hide' );
            classie.add( fakePadding, 'hide' );
            // remove shadow
            wrapper.style.boxShadow = '';
          }
        }
      }
    }, 0));
  };

  /**
   * Public method destroyHorizontalControl
   */
  WrapkitSidebar.prototype.destroyHorizontalControl = function() {
    var _this = this,
    wrapper = _this.elem.querySelector( '.nav-wrapper' ),
    nav = wrapper.querySelector( '.nav' ),
    ctrl = wrapper.querySelector( '.nav-ctrl' ),
    fakePadding = wrapper.querySelector( '.nav-fake-padding' );
    // just remove nav ctrl and fake padding
    if(ctrl !== null && fakePadding !== null){
      ctrl.parentElement.removeChild(ctrl);
      fakePadding.parentElement.removeChild(fakePadding);
      // then remove shadow
      wrapper.style.boxShadow = '';
      nav.style.marginLeft = '';
    }
  };

  /**
   * Public method updateHorizontalControl
   */
  WrapkitSidebar.prototype.updateHorizontalControl = function() {
    var _this = this;
    // destroy it then create newer
    _this.destroyHorizontalControl();
    _this.horizontalControl();
  };


  /**
   * Public method setMode
   * @return {String} mode
   */
  WrapkitSidebar.prototype.setMode = function(mode) {
    var _this = this,
    nav = _this.elem.querySelector('.nav-wrapper .nav');

    if (_this.options.rtlMode) {
      _this.rtl(false);
    }

    // collapse open menus
    if (mode === 'horizontal') {
      var openMenu = _this.elem.querySelectorAll('li.open');
      [].forEach.call(openMenu, function(menu){
        _this._collapse(menu);
      });
    }

    // then updating components
    _this._updateCaret();
    _this.updateHorizontalControl();

    // control for horizontal menu
    if (mode === 'horizontal') {
      // remove classes
      classie.remove( body, 'wrapkit-sidebar-vertical' );
      classie.remove( nav, 'nav-stacked' );
      // add classes
      classie.add( body, 'wrapkit-sidebar-horizontal' );
      // temporary disable live resizable
      if (_this.options.resizable) {
        classie.add(_this.elem.querySelector('.sidebar-resize-handler'), 'hide');
        _this.elem.style.width = '';
      }
      // stacked menu
      if( WrapkitUtils.viewport().width < 768 ){
        classie.add( _this.elem.querySelector('.nav-wrapper .nav'), 'nav-stacked' );
        _this.elem.querySelector('.nav-wrapper .nav').style.marginLeft = '';
      } else{
        classie.remove( _this.elem.querySelector('.nav-wrapper .nav'), 'nav-stacked' );
        _this.elem.style.width = '';
      }
    } else{
      // remove classes
      classie.remove( body, 'wrapkit-sidebar-horizontal' );
      // add classes
      classie.add( body, 'wrapkit-sidebar-vertical' );
      classie.add( nav, 'nav-stacked' );
      // enable live resizable
      if (_this.options.resizable) {
        classie.remove(_this.elem.querySelector('.sidebar-resize-handler'), 'hide');
      }
    }

    // update options
    _this.options.mode = mode;

    // trigger when mode changed
    _this.emit('setMode', _this, mode);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'setMode', mode);
  };

  /**
   * Public method resize
   */
   WrapkitSidebar.prototype.resize = function(){
    var _this = this,
    r = (this.options.align === 'left') ? '.sidebar-resize-handler' : false,
    l = (this.options.align === 'right') ? '.sidebar-resize-handler' : false;

    var handler = document.createElement('div');
    classie.add( handler, 'sidebar-resize-handler' );

    if (_this.elem.querySelector('.sidebar-resize-handler') !== null) {
      _this.elem.querySelector('.sidebar-resize-handler').parentNode.removeChild(_this.elem.querySelector('.sidebar-resize-handler'));
    }

    // add handler if allow resizable
    if(_this.options.resizable){
      _this.elem.appendChild(handler);
    }

    interact( _this.elem ).resizable({
      edges: { left: l, right: r, bottom: false, top: false }
    })
    .on('resizemove', function (ev) {
      var target = ev.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0),
      width = ev.rect.width;

      // update the element's style
      width = ( width < _this.options.minResize ) ? _this.options.minResize : width;
      width = ( width > _this.options.maxResize ) ? _this.options.maxResize : width;

      target.style.width  = width + 'px';
      target.style.opacity  = 0.8;
      target.style.webkitTransform = target.style.transform = 'translateX(' + x + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-cw', width);
      ev.rect.width = width;
    })
    .on( 'resizeend', function(ev){
      var target = ev.target,
          breakpoint = 768, // refer to bootstrap breakpoint
          currentWidth = parseFloat(target.getAttribute('data-cw')),
          contentWrapper = document.querySelector('.content-wrapper'),
          footerWrapper = document.querySelector('.footer-wrapper');

          target.style.opacity = 1;
          if ( WrapkitUtils.viewport().width >= breakpoint) {
            if (_this.options.align === 'left') {
              if (contentWrapper) {
                contentWrapper.style.paddingLeft = currentWidth + 'px';
              }
              if (footerWrapper) {
                footerWrapper.style.paddingLeft = currentWidth + 'px';
              }
            } else{
              if (contentWrapper) {
                contentWrapper.style.paddingRight = currentWidth + 'px';
              }
              if (footerWrapper) {
                footerWrapper.style.paddingRight = currentWidth + 'px';
              }
            }
          }

      // trigger when skin changed
      _this.emit('resize', _this, currentWidth);
      // emit event jquery
      WrapkitUtils.jqEmiter(_this.$elem, 'resize', currentWidth);
    });
  };

  /**
   * Public method resizable
   */
   WrapkitSidebar.prototype.resizable = function( resizable ){
    var _this = this,
    handler;

    if (_this.options.mode === 'horizontal') {
      return;
    }

    if (resizable) {
      handler = document.createElement('div');
      classie.add( handler, 'sidebar-resize-handler' );

      _this.elem.appendChild(handler);
    } else{
      handler = document.querySelector('.sidebar-resize-handler');

      _this.elem.removeChild(handler);
    }

    // update options
    _this.options.resizable = resizable;

    // trigger when skin changed
    _this.emit('resizable', _this, resizable);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'resizable', resizable);
  };

  /**
   * Public method isResizable
   */
   WrapkitSidebar.prototype.isResizable = function(){
    return this.options.resizable;
  };


  /**
   * Public method align
   */
   WrapkitSidebar.prototype.align = function( align ){
    var _this = this;

    classie.remove(body, 'wrapkit-sidebar-left');
    classie.remove(body, 'wrapkit-sidebar-right');

    classie.add(body, 'wrapkit-sidebar-' + align);

    // also add class align to nav
    var nav = _this.elem.querySelector('.nav');
    classie.remove(nav, 'nav-left');
    classie.remove(nav, 'nav-right');
    classie.add(nav, 'nav-' + align);

    // update options
    _this.options.align = align;

    // update resize edges
    _this.resize();
    var cw = _this.elem.dataset.cw,
    contentWrapper = document.querySelector('.content-wrapper'),
    footerWrapper = document.querySelector('.footer-wrapper');
    if (cw && _this.options.size === 'lg') {
      if (align === 'left') {
        // set & unset
        if (contentWrapper) {
          contentWrapper.style.paddingLeft = cw + 'px';
          contentWrapper.style.paddingRight = '';
        }
        if (footerWrapper) {
          footerWrapper.style.paddingLeft = cw + 'px';
          footerWrapper.style.paddingRight = '';
        }
      } else{
        // set & unset
        if (contentWrapper) {
          contentWrapper.style.paddingRight = cw + 'px';
          contentWrapper.style.paddingLeft = '';
        }
        if (footerWrapper) {
          footerWrapper.style.paddingRight = cw + 'px';
          footerWrapper.style.paddingLeft = '';
        }
      }
    }

    // trigger when align changed
    _this.emit('align', _this, align);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'align', align);
  };


  /**
   * Public method rtl
   */
   WrapkitSidebar.prototype.rtl = function( rtl ){
    var _this = this,
    nav = _this.elem.querySelector('.nav');

    if (rtl) {
      if (_this.options.mode === 'horizontal') {
        window.alert('The rtl direction is not support for horizontal sidebar!');
        return;
      }
      classie.add(body, 'wrapkit-sidebar-rtl');
      classie.add(nav, 'nav-rtl');
    } else{
      classie.remove(body, 'wrapkit-sidebar-rtl');
      classie.remove(nav, 'nav-rtl');
    }

    // update options
    _this.options.rtlMode = rtl;

    // trigger when rtl changed
    _this.emit('rtl', _this, rtl);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'rtl', rtl);
  };


  /**
   * Public method size
   */
   WrapkitSidebar.prototype.size = function( size ){
    var _this = this;

    classie.remove(body, 'wrapkit-sidebar-lg');
    classie.remove(body, 'wrapkit-sidebar-sm');

    classie.add(body, 'wrapkit-sidebar-' + size);

    if ( size === 'sm' ) {
      var contentWrapper = document.querySelector('.content-wrapper'),
      footerWrapper = document.querySelector('.footer-wrapper');

      if (contentWrapper) {
        contentWrapper.style.paddingLeft = '';
        contentWrapper.style.paddingRight = '';
      }
      if (footerWrapper) {
        footerWrapper.style.paddingLeft = '';
        footerWrapper.style.paddingRight = '';
      }

      _this.elem.style.width = '';
    }
    // update fixed position (couse the sidebar height has been changed)
    // but, wait until transition done
    if (_this.options.fixed) {
      setTimeout(function(){
        _this.fixed(true);
      }, 250);
    }

    // update horizontal elements
    _this.updateHorizontalControl();

    // update options
    _this.options.size = size;

    // trigger when size changed
    _this.emit('size', _this, size);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'size', size);
  };


  /**
   * Public method setContext
   */
   WrapkitSidebar.prototype.setContext = function( context ){
    var _this = this,
    old = this.options.context,
    current = context,
    prefix = this.options.variant === 'tabs' ? 'nav-contrast-' : 'nav-',
    nav = document.querySelector('.nav'),
    navChild = nav.querySelectorAll('.nav-child');

    // remove old context
    classie.remove( nav, 'nav-contrast-' + old );
    classie.remove( nav, 'nav-' + old );
    // add new context
    classie.add( nav, prefix + current );

    // add context to nav childs
    [].forEach.call( navChild, function(el){
      // remove old context
      classie.remove( el, 'nav-' + old );
      // add new context
      classie.add( el, 'nav-' + current );
    });

    // update options
    _this.options.context = current;

    // trigger when skin changed
    _this.emit('setContext', _this, old, current);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'setContext', [old, current]);
  };

  /**
   * Public method setSkin
   * @param {String} skin
   */
   WrapkitSidebar.prototype.setSkin = function( skin ) {
    var _this = this,
    old = _this.options.skin,
    current = skin;

    // remove active skin
    classie.remove( _this.elem, 'sidebar-' + old );
    // add current skin
    classie.add( _this.elem, 'sidebar-' + current );

    // update options
    _this.options.skin = current;

    // update horizontal control
    _this.updateHorizontalControl();

    // trigger when skin changed
    _this.emit('setSkin', _this, old, current);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'setSkin', [old, current]);
  };

  /**
   * Public method setVariant
   * @param {String} variant
   */
   WrapkitSidebar.prototype.setVariant = function( variant ) {
    var _this = this,
    old = _this.options.variant,
    current = variant,
    nav = document.querySelector('.nav');

    // remove old variant
    classie.remove( nav, 'nav-' + old );
    // add new variant
    classie.add( nav, 'nav-' + current );

    // update options
    _this.options.variant = current;

    // update context
    _this.setContext(_this.options.context);

    // trigger when variant changed
    _this.emit('setVariant', _this, old, current);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'setVariant', [old, current]);
  };

  /**
   * Public method fixed
   * @param {Boolean} fixed
   */
   WrapkitSidebar.prototype.fixed = function( fixed ) {
    var _this = this,
    navWrapper = _this.elem.querySelector('.nav-wrapper'),
    setNavHeight = function(){
      var viewportY = WrapkitUtils.viewport().height,
      offsetY = WrapkitUtils.offsets(navWrapper).top,
      nh = viewportY - offsetY;

      if (_this.options.mode === 'vertical' || (WrapkitUtils.viewport().width < 768 && _this.options.mode === 'horizontal') ) {
        navWrapper.style.height = nh + 'px';
      } else{
        navWrapper.style.height = '';
      }
    },
    sticky = function(){

      if ( !classie.has( body, 'wrapkit-header-fixed-top') ) {
        if (window.scrollY > WrapkitUtils.offsets(_this.elem).top) {
          classie.add( _this.elem, 'sidebar-sticky');
        } else{
          classie.remove( _this.elem, 'sidebar-sticky');
        }

        // debounce it
        // update scrolling height on add/remove sticky
        WrapkitUtils.debounce(setNavHeight, 250);

        // trigger when variant changed
        _this.emit('sticky');
        // emit event jquery
        WrapkitUtils.jqEmiter(_this.$elem, 'sticky');
      }
    },
    toLg = WrapkitUtils.debounce( function(){
      if (_this.options.fixed && _this.options.size === 'sm' && ( _this.options.mode === 'vertical' || (WrapkitUtils.viewport().width < 768 && _this.options.mode === 'horizontal') )) {
        _this.size('lg');
        _this.fakeSize = true;
      }
    }, 250),
    toSm = WrapkitUtils.debounce( function(){
      if (_this.fakeSize && ( _this.options.mode === 'vertical' || (WrapkitUtils.viewport().width < 768 && _this.options.mode === 'horizontal') )) {
        _this.size('sm');

        // collapse open childs
        var openChilds = _this.elem.querySelector('li.open');
        if ( openChilds ) {
          _this._collapse( openChilds );
        }

        _this.fakeSize = false;
      }
    }, 250);

    if (fixed) {
      // normalize min height
      var wrapper = document.querySelector('.wrapkit-wrapper'),
      content = document.querySelector('.content-wrapper');
      wrapper.style.minHeight = '';
      content.style.minHeight = '';

      // add class fixed
      classie.add( body, 'wrapkit-sidebar-fixed' );
      // add/remove sticky
      sticky();

      // add listener
      window.addEventListener( 'scroll', sticky );
      window.addEventListener( 'resize', WrapkitUtils.debounce(setNavHeight, 250) );
      _this.elem.addEventListener( 'mouseenter', toLg);
      _this.elem.addEventListener( 'mouseleave', toSm);

      // enable scrolling by set height on .nav
      setNavHeight();
    } else{
      // reset to relative
      // but, wait until transition done
      setTimeout(function(){
        // update layout height
        _this._updateLayoutHeight();
        // disable scrolling
        navWrapper.style.height = '';
      }, 250);

      // remove class fixed
      classie.remove( body, 'wrapkit-sidebar-fixed' );

      // remove event listener
      window.removeEventListener( 'scroll', sticky );
      window.removeEventListener( 'resize', WrapkitUtils.debounce(setNavHeight, 250) );
      _this.elem.removeEventListener( 'mouseenter', toLg);
      _this.elem.removeEventListener( 'mouseleave', toSm);
    }

    // hack for bug render on chrome
    if (_this.elem.querySelector('.sidebar-block')) {
      _this.elem.querySelector('.sidebar-block').style.display = 'none';
      setTimeout(function(){
        _this.elem.querySelector('.sidebar-block').style.display = '';
      }, 0);
    }

    // update options
    _this.options.fixed = fixed;

    // trigger when fixed changed
    _this.emit('fixed', _this, fixed);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'fixed', fixed);
  };

  /**
   * Public method showLoader
   * @param {Int}    index
   * @param {String} fixed
   */
   WrapkitSidebar.prototype.showLoader = function( index, icon ) {
    var _this = this,
    navNode = _this.elem.querySelector('.nav'),
    fakeIndex = index - 1,
    lists = navNode.querySelectorAll('.nav-item'),
    target = lists[fakeIndex],
    iconWrapper = target.querySelector('.nav-icon');

    var loader = document.createElement('span');

    if ( !icon ) {
      icon = _this.options.loader;
    }

    classie.add(loader, 'fa');
    classie.add(loader, 'fa-spin');
    classie.add(loader, icon);

    classie.add(target, 'loader-state-show');
    classie.add(iconWrapper, 'nav-loader');
    iconWrapper.appendChild(loader);

    // update options
    _this.options.loader = icon;

    // trigger when loader show
    _this.emit('showLoader', _this, loader, target);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'showLoader', [loader, target]);
  };

  /**
   * Public method hideLoader
   * @param {Int}    index
   * @param {String} fixed
   */
   WrapkitSidebar.prototype.hideLoader = function( index ) {
    var _this = this,
    navNode = _this.elem.querySelector('.nav'),
    fakeIndex = index - 1,
    lists = navNode.querySelectorAll('.nav-item'),
    target = lists[fakeIndex],
    iconWrapper = target.querySelector('.nav-icon'),
    loader = iconWrapper.querySelector( '.' + _this.options.loader);

    iconWrapper.removeChild(loader);
    classie.remove(target, 'loader-state-show');
    classie.remove(iconWrapper, 'nav-loader');

    // trigger when loader hide
    _this.emit('hideLoader', _this, _this.options.loader, target);
    // emit event jquery
    WrapkitUtils.jqEmiter(_this.$elem, 'hideLoader', [_this.options.loader, target]);
  };


  // =============================================================
  // jQuery bridget
  // =============================================================
  if ( $ && $.bridget ) {
    $.bridget( 'wrapkitSidebar', WrapkitSidebar );
  }


  // =============================================================
  // RETURN
  // =============================================================
  return WrapkitSidebar;
});
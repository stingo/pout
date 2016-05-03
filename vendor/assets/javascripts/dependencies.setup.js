(function(){
  'use strict';

  // Form basic
  $('.autogrow').autoGrow();

  var Switchery = window.Switchery,
  jsSwitch = document.querySelectorAll('.js-switch');

  // Initialize Switchery
  [].forEach.call( jsSwitch, function( el ){
    var data = el.dataset,
    options = {
      color           : ( data.color ) ? data.color : '#48CFAD',
      jackColor       : ( data.jackColor ) ? data.jackColor : '#ffffff',
      jackSecondaryColor : ( data.jackSecondaryColor ) ? data.jackSecondaryColor : '#CCD1D9',
      secondaryColor  : ( data.secondaryColor ) ? data.secondaryColor : '#E6E9ED',
      className       : ( data.className ) ? data.className : 'switchery',
      disabled        : ( data.disabled ) ? data.disabled : false,
      disabledOpacity : ( data.disabledOpacity ) ? data.disabledOpacity : 0.5,
      speed           : ( data.speed ) ? data.speed : '0.3s'
    };

    new Switchery( el, options );
  });
  // Change switchery
  // function switcheryOnChange(el) {
  //   el = (typeof(el) === 'string') ? document.querySelector(el) : el;
  //   if (typeof Event === 'function' || !document.fireEvent) {
  //     var event = document.createEvent('HTMLEvents');
  //     event.initEvent('change', true, true);
  //     el.dispatchEvent(event);
  //   } else {
  //     el.fireEvent('onchange');
  //   }
  // }
})(window);
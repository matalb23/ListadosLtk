$(function () {
  "use strict" ;
  // start globalfunction
  // add fav aicon
  // $('head').append('<link rel="icon" href="../../dist/images/fav.png">');
  // // add loading page
  // $('body').prepend('<div id="loading">loading...</div>');
  // $('#loading').addClass('fixed');
  // $('.fixed').css({
  //   'position': 'fixed',
  //   'top':'0',
  //   'z-index':'99999999',
  //   'width': '100%' ,
  //   'height': '100%',
  //   'background': '#1cbac8',
  //   'text-align': 'center',
  //   'padding-top': '28%',
  //   'color': '#fff',
  //   'font-size': '20px',
  //   'letter-spacing': '4px',
  //   'opacity': '1',
  //   'transition': 'all 0.333s'
  // });
  // function diplayLoad(){
  //   $('#loading').css({
  //     'opacity': '0',
  //     'display': ' none'
  //   });
  // };
  // setTimeout(diplayLoad , 3000);

  // add scrolling style
  // $("html").niceScroll(
  //   {
  //     cursorcolor: "#000" ,
  //     cursorborder: "0" ,
  //     // cursoropacitymin: 0.4 ,
  //     cursoropacitymax: 0.4 ,
  //     cursorwidth: "8px" ,
  //     mousescrollstep: 40,
  //     zindex: 9990
  //   }
  // );

  // navabrs
  // change logo
  if ('.invers') {
    $('.invers .navbar-brand img').attr('src' , '../../dist/images/logo2.png');
    }else {
    console.log('err');
  }
  // navbar on scroll for background

  var nav = $('.invers-fixed');

  if (document.contains(nav[0])) {
    var ofNav = nav.offset().top;
  }

  $(document).on('scroll', function () {

    if ($(this).scrollTop() > ofNav ) {
      $('.invers-fixed').css(
        {
          "background":"rgba(0,0,0,0.8)" ,
          'border-bottom':'0' ,
          'transition' : 'all 0.3s'
        }
      );
    }else {
      $('.invers-fixed').css(
        {
          "background":"transparent" ,
          'border-bottom':' 1px solid rgba(250,250,250,0.1)'
        }
      );
    }

  });

  // start anemation
  // page10
  if ('.box') {
    $('.box')
      .addClass('animated zoomIn')
      .css({
        'z-index' : '2'
      });
  }
  if ('.animated-img') {
    $('.animated-img')
      .addClass('animated lightSpeedIn')
      .css({
        'z-index' : '1'
      });
  }
  // end anemation
  // end global function
});

(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 56)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 57
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Scroll reveal calls
  window.sr = ScrollReveal();
  sr.reveal('.sr-icons', {
    duration: 600,
    scale: 0.3,
    distance: '0px'
  }, 200);
  sr.reveal('.sr-card', {
    duration: 1000,
    delay: 200,
    scale: 0.8,
    distance: '100px'
  }, 300);

  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    $(".fantuan-download-android").show();
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    $(".fantuan-download-ios").show();
  }

  $(window).scroll(function() {
    var top = document.getElementById('scoop-bg').getBoundingClientRect().top;

    if (window.innerHeight < top + window.innerHeight * 0.4) {
      $('#scoop-fg-1').attr('class', 'scoop img-fluid');
      $('#scoop-fg-2').attr('class', 'scoop img-fluid hidden');
      $('#scoop-fg-3').attr('class', 'scoop img-fluid hidden');
    } else if (window.innerHeight < top + window.innerHeight * 0.5) {
      $('#scoop-fg-1').attr('class', 'scoop img-fluid hidden');
      $('#scoop-fg-2').attr('class', 'scoop img-fluid');
      $('#scoop-fg-3').attr('class', 'scoop img-fluid hidden');
    } else if (window.innerHeight < top + window.innerHeight * 0.8) {
      $('#scoop-fg-1').attr('class', 'scoop img-fluid hidden');
      $('#scoop-fg-2').attr('class', 'scoop img-fluid hidden');
      $('#scoop-fg-3').attr('class', 'scoop img-fluid');
    }
  });


  $('.scoop-container').height($('#scoop-bg').height());
  $(window).on('resize', function(){
      $('.scoop-container').height($('#scoop-bg').height());
  });

  $(window).on('load', function() {
    var header = $('header.masthead');
    header.attr('class','masthead text-center text-white d-flex bg-fade bg-transparent');

  });
  var date = new Date();
  if (date.getHours() < 11) {
    $('.hours-today').removeClass('d-none');
    $('.hours-now').addClass('d-none');
    $('.hours-tomorrow').addClass('d-none');
  } else if (date.getHours() >= 20) {
    $('.hours-today').addClass('d-none');
    $('.hours-now').addClass('d-none');
    $('.hours-tomorrow').removeClass('d-none');
  } else {
    $('.hours-today').addClass('d-none');
    $('.hours-now').removeClass('d-none');
    $('.hours-tomorrow').addClass('d-none');
  };

  var scene = document.getElementById('hand-scene');
  var parallaxInstance = new Parallax(scene);
  $('#scene-clamp').attr('class','shadow-lg');

  $('.header-btn').on('mousedown', function() {
    $('header.masthead').attr('class','masthead text-center text-white d-flex bg-white');
    $('#order-mask').attr('class',"header-mask mask rgba-red-strong bg-white");
    $('#social-container').attr('class','d-lg-flex hidden');
  });
  $('.header-btn').on('mouseup', function() {
    $('header.masthead').attr('class','masthead text-center text-white d-flex bg-fade bg-transparent');
    $('#order-mask').attr('class',"header-mask mask rgba-white-strong bg-fade");
    $('#social-container').attr('class','d-lg-flex');
    window.scrollTo(0, $('#order').offset().top);
  });

})(jQuery); // End of use strict

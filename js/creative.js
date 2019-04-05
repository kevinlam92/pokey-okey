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
    duration: 300,
    scale: 0.3,
    distance: '0px'
  }, 100);
  sr.reveal('.sr-card', {
    duration: 1000,
    delay: 200,
    scale: 0.8,
    distance: '100px'
  }, 300);

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
  $(window).on('resize', function() {
    $('.scoop-container').height($('#scoop-bg').height());
  });

  $(window).on('load', function() {
    var header = $('header.masthead');
    header.attr('class', 'masthead text-center text-white d-flex bg-fade bg-transparent');
    $('.scoop-container').height($('#scoop-bg').height());
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
  $('#scene-clamp').attr('class', 'shadow-lg');

  $('.header-btn').on('mousedown', function() {
    $('header.masthead').attr('class', 'masthead text-center text-white d-flex bg-white');
    $('#order-mask').attr('class', "header-mask mask rgba-red-strong bg-white");
  });
  $('.header-btn').on('mouseup', function() {
    $('header.masthead').attr('class', 'masthead text-center text-white d-flex bg-fade bg-transparent');
    $('#order-mask').attr('class', "header-mask mask rgba-white-strong bg-fade");
    window.scrollTo(0, $('#order').offset().top - 56);
  });

  function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return 1;
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 2;
    }
    return 0;
  }

  switch (getMobileOperatingSystem()) {
    case 1:
      //android
      $('#fantuan .app-badge-icon').hide();
      $('#fantuan .app-badge-icon.android').show();
      $('#fantuan .app-tagline').hide();
      $('#fantuan').attr('href', 'https://play.google.com/store/apps/details?id=com.ca.fantuan.customer&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1');
      break;
    case 2:
      //ios
      $('#fantuan .app-badge-icon').hide();
      $('#fantuan .app-badge-icon.ios').show();
      $('#fantuan .app-tagline').hide();
      $('#fantuan').attr('href', 'https://itunes.apple.com/ca/app/%E9%A5%AD%E5%9B%A2-%E5%8A%A0%E6%8B%BF%E5%A4%A7%E5%A4%96%E5%8D%96%E9%A4%90%E9%A5%AE%E5%93%81%E8%B4%A8%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0/id1218697769?mt=8');
      break;
    default:
      $('#fantuan .app-badge-icon').hide();
      $('#fantuan .app-tagline').show();
  }

})(jQuery); // End of use strict

//Vue

Vue.component('menu-section', {
  props: ['header'],
  template: '<div class="row mb-5">' +
    ' <div class="col-lg-12 mx-auto text-center my-4">' +
    '   <h3 class="section-heading">{{ header }}</h3>' +
    ' </div>' +
    ' <slot></slot>' +
    '</div>'
});

Vue.component('menu-item', {
  props: ['image', 'name', 'price', 'description'],
  template: '<div v-bind:class="[(image && image.startsWith(\'fa-\')) ? \'col-lg-12\' : \'col-lg-4\' ]" class="text-center">' +
    ' <div class="menu-item">' +
    '  <div v-if="image" class="menu-thumb-container sr-icons">' +
    '    <picture v-if="!image.startsWith(\'fa-\')">' +
    '      <source v-bind:srcset="image.substr(0, image.lastIndexOf(\'.\')) + \'.webp\'" type="image/webp">' +
    '      <source v-bind:srcset="image" type="image/jpg">' +
    '      <img class="menu-thumb" v-bind:src="image"/>' +
    '    </picture>' +
    '    <div v-if="image.startsWith(\'fa-\')" class="fa-stack">' +
    '      <i class="fa fa-circle fa-stack-2x text-primary"></i>' +
    '      <i v-bind:class="image" class="fas fa-stack-1x text-white"></i>' +
    '    </div>' +
    '  </div>' +
    '  <div class="menu-item-content">' +
    '    <div class="menu-item-title">' +
    '      <p v-if="name" class="name">{{ name }}</p>' +
    '      <p class="spacer"/>' +
    '      <p v-if="price" class="price">${{ price }}</p>' +
    '    </div>' +
    '    <p v-if="description" class="description mb-5">{{ description }}</p>' +
    '  </div>' +
    ' </div>' +
    '</div>'
});

var menu = new Vue({
  el: '#menu',
  data: MENU
});
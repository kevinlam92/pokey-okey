(function($) {
  "use strict"; // Start of use strict

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

  // Scroll reveal calls
  window.sr = ScrollReveal();
  sr.reveal('.sr-card', {
    duration: 1000,
    delay: 0,
    origin: 'top',
    distance: '2rem',
    scale: 0.9,
  }, 100);

  sr.reveal('.sr-check', {
    duration: 1000,
    delay: 0,
    origin: 'top',
    distance: '2rem',
    scale: 0.9,
  }, 100);

})(jQuery); // End of use strict

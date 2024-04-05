$(document).ready(function () {
  function adjustLayout() {
    var screenWidth = $(window).width();
    var $controls = $(".controls");

    if (screenWidth < 600) {
      
      ;
    } else if (screenWidth > 1500) {
      
    }
  }

  adjustLayout();

  $(window).resize(function () {
    adjustLayout();
  });
});

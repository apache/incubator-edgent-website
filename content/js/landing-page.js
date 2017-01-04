// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

$('div.modal').on('show.bs.modal', function() {
	var modal = this;
	var hash = modal.id;
	window.location.hash = hash;
	window.onhashchange = function() {
		if (!location.hash){
			$(modal).modal('hide');
		}
	}
});

var isFixed = false;
var navBar = document.getElementById('nav-bar');
var navContainer = document.getElementById('nav-container');
var triggerPageOffset = 224;//height of the top banner
    window.addEventListener('scroll', function() {
      var pageOffset = window.pageYOffset;
      if (pageOffset > triggerPageOffset) {
        if (!isFixed) {
          isFixed = true;
//we need to make sure the parent containers height does not change when the child's position is fixed
          navBar.style.minHeight = navBar.scrollHeight + 'px';
          navContainer.classList.add('fixed-nav-container');
        }
      } else {
        if (isFixed) {
//user has scrolled upwards so remove the fixed class
          isFixed = false;
          navContainer.classList.remove('fixed-nav-container');
          navBar.style.minHeight = '';
        }
      }
    });

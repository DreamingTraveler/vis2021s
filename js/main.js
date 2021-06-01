(function($) {

	"use strict";

	var burgerMenu = function() {

		$('.js-colorlib-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');	
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');	
			}
		});
	};
	burgerMenu();

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
	    	
	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
		});

	};
	mobileMenuOutsideClick();

	$(".lab-link").click(function(){
		$(".colorlib-active").removeClass("colorlib-active")
		$(this).parent("li").addClass("colorlib-active")

		if ($(this).html() != "Home") {
			$("#colorlib-main").css("background-image", "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)")
			$(".colorlib-nav-toggle").addClass("dark")
		}

		else{
			$("#colorlib-main").css("background-image", "url('img/cat1.jpg')")
			$(".colorlib-nav-toggle").removeClass("dark")
		}
	})
})(jQuery);

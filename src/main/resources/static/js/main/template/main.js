(function () {

	"use strict";

	//===== Prealoder

	window.onload = function () {
		window.setTimeout(fadeout, 200);
	}

	function fadeout() {
		document.querySelector('.preloader').style.opacity = '0';
		document.querySelector('.preloader').style.display = 'none';
	}


	/*=====================================
	Sticky
	======================================= */
	window.onscroll = function () {
		var header_navbar = document.querySelector(".navbar-area");
		var sticky = header_navbar.offsetTop;

		if (window.pageYOffset > sticky) {
			header_navbar.classList.add("sticky");
		} else {
			header_navbar.classList.remove("sticky");
		}
	};

	//===== navbar-toggler
	let navbarToggler = document.querySelector(".navbar-toggler");
	navbarToggler.addEventListener('click', function () {
		navbarToggler.classList.toggle("active");
	})


	//======== tiny slider
	tns({
		container: '.client-logo-carousel',
		autoplay: true,
		autoplayButtonOutput: false,
		mouseDrag: true,
		gutter: 15,
		nav: false,
		controls: false,
		responsive: {
			0: {
				items: 1,
			},
			540: {
				items: 2,
			},
			768: {
				items: 3,
			},
			992: {
				items: 4,
			}
		}
	});


	//WOW Scroll Spy
	var wow = new WOW({
		//disabled for mobile
		mobile: false
	});
	wow.init();

	 //====== counter up 
     var cu = new counterUp({
        start: 0,
        duration: 2000,
        intvalues: true,
        interval: 100,
        append: " ",
    });
    cu.start();
    
	//======= portfolio-btn active
	var elements = document.getElementsByClassName("portfolio-btn");
	for (var i = 0; i < elements.length; i++) {
		elements[i].onclick = function () {

			// remove class from sibling

			var el = elements[0];
			while (el) {
				if (el.tagName === "BUTTON") {
					//remove class
					el.classList.remove("active");

				}
				// pass to the new sibling
				el = el.nextSibling;
			}

			this.classList.add("active");
		};
	}

	//========= glightbox
	GLightbox({
		'href': 'https://youtu.be/t0zB-fOuzEk',
		'type': 'video',
		'source': 'youtube', //vimeo, youtube or local
		'width': 900,
		'autoplayVideos': true,
	});

	//====== Clients Logo Slider
	tns({
		container: '.client-logo-carousel',
		slideBy: 'page',
		autoplay: true,
		autoplayButtonOutput: false,
		mouseDrag: true,
		gutter: 15,
		nav: false,
		controls: false,
		responsive: {
			0: {
				items: 1,
			},
			540: {
				items: 2,
			},
			768: {
				items: 3,
			},
			992: {
				items: 4,
			},
			1170: {
				items: 6,
			}
		}
	});

	//======== Home Slider
	var slider = new tns({
		container: '.home-slider',
		slideBy: 'page',
		autoplay: false,
		mouseDrag: true,
		gutter: 0,
		items: 1,
		nav: true,
		controls: false,
		controlsText: [
			'<i class="lni lni-arrow-left prev"></i>',
			'<i class="lni lni-arrow-right next"></i>'
		],
		responsive: {
			1200: {
				items: 1,
			},
			992: {
				items: 1,
			},
			0: {
				items: 1,
			}

		}
	});

	//======== Testimonial Slider
	/*var TestSlider = new tns({
		container: '.testimonial-slider',
		slideBy: 'page',
		autoplay: false,
		mouseDrag: true,
		gutter: 0,
		items: 1,
		nav: true,
		controls: false,
		controlsText: [
			'<i class="lni lni-arrow-left prev"></i>',
			'<i class="lni lni-arrow-right next"></i>'
		],
		responsive: {
			1200: {
				items: 2,
			},
			992: {
				items: 1,
			},
			0: {
				items: 1,
			}

		}
	});*/

	//============== isotope masonry js with imagesloaded
	imagesLoaded('#container', function () {
		var elem = document.querySelector('.grid');
		var iso = new Isotope(elem, {
			// options
			itemSelector: '.grid-item',
			masonry: {
				// use outer width of grid-sizer for columnWidth
				columnWidth: '.grid-item'
			}
		});

		let filterButtons = document.querySelectorAll('.portfolio-btn-wrapper button');
		filterButtons.forEach(e =>
			e.addEventListener('click', () => {

				let filterValue = event.target.getAttribute('data-filter');
				iso.arrange({
					filter: filterValue
				});
			})
		);
	});

	// header animation
	const navbar = $('#nav');

	navbar.find('li').click(function (e) {

		$(this).toggleClass('active');
		$(this).siblings().removeClass("active");

		console.log($(this));
	});



})();

// ====== scroll top js
window.onscroll = function () {
        var header_navbar = document.querySelector(".navbar-area");
        var sticky = header_navbar.offsetTop;
        if (window.pageYOffset > sticky) {
            header_navbar.classList.add("sticky");
        } else {
            header_navbar.classList.remove("sticky");
        }
        var backToTo = document.querySelector(".scroll-top");
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTo.style.display = "block";
        } else {
            backToTo.style.display = "none";
        }
    };

Math.easeInOutQuad = function (t, b, c, d) {

	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

document.querySelector('.scroll-top').onclick = function () {
	scrollTo(document.documentElement); 
}


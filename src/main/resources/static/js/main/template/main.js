(function () {

	document.querySelector('.scroll-top').addEventListener('click', function () {
		// 메뉴바의 클래스나 아이디를 사용하여 해당 요소를 찾아냅니다.
		var menuBar = document.querySelector('.header.navbar-area.div-0');

		// 메뉴바로 스크롤합니다.
		menuBar.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	});


	$('.glightbox.video.first').on('click', function () {
		var video_first = $('#video1')[0]; // jQuery 객체를 JavaScript DOM 요소로 변환
		$('.glightbox.video.first').hide();
		video_first.play();
	});

	$('.glightbox.video.second').on('click', function () {
		var video_second = $('#video2')[0]; // jQuery 객체를 JavaScript DOM 요소로 변환
		$('.glightbox.video.second').hide();
		video_second.play();
	});

	function initializeSwiper() {
		// Swiper가 모든 main.js가 실행되는 페이지에 사용될 필요가 없음. 연쇄 오류를 방지하기 위해 해당 라이브러리가 포함된 곳에서만 동작하도록 수정
		if(typeof Swiper !== "undefined") {
			var swiper = new Swiper(".swiper-container", {
				spaceBetween: 0,
				slidesPerView: 1, // Set to 1 to show one slide at a time
				centeredSlides: true,
				autoplay: {
					delay: 2500,
					disableOnInteraction: false,
				},
				loop: false,
				loopAdditionalSlides: 1,
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
				},
			});
		}
	}

	function about_Swiper() {
		// Swiper가 모든 main.js가 실행되는 페이지에 사용될 필요가 없음. 연쇄 오류를 방지하기 위해 해당 라이브러리가 포함된 곳에서만 동작하도록 수정
		if(typeof Swiper !== "undefined") {
			var swiper = new Swiper(".swiper-container-about", {
				spaceBetween: 2000,
				slidesPerView: 1, // Set to 1 to show one slide at a time
				centeredSlides: true,
				loop: false,
				loopAdditionalSlides: 1,
				pagination: {
					el: ".swiper-pagination-about",
					clickable: true,
				},
				navigation: {
					nextEl: ".swiper-button-next-about",
					prevEl: ".swiper-button-prev-about",
				},
			});
		}
	}

	function gallery_Swiper() {
		// Swiper가 모든 main.js가 실행되는 페이지에 사용될 필요가 없음. 연쇄 오류를 방지하기 위해 해당 라이브러리가 포함된 곳에서만 동작하도록 수정
		if(typeof Swiper !== "undefined") {
			var swiper = new Swiper(".swiper-container-gallery", {
				spaceBetween: 2000,
				slidesPerView: 1, // Set to 1 to show one slide at a time
				centeredSlides: true,
				loop: false,
				loopAdditionalSlides: 1,
				pagination: {
					el: ".swiper-pagination-gallery",
					clickable: true,
				},
				navigation: {
					nextEl: ".swiper-button-next-gallery",
					prevEl: ".swiper-button-prev-gallery",
				},
			});
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		initializeSwiper();
		about_Swiper();
		gallery_Swiper();
	});

	$(".custom-prev-button-about").on('click', function (){
		$(this).toggleClass('clicked');
		$(".custom-next-button-about").removeClass('clicked');
		$(".swiper-button-prev-about").click()
	})

	$(".custom-next-button-about").on('click', function (){
		$(this).toggleClass('clicked');
		$(".custom-prev-button-about").removeClass('clicked');
		$(".swiper-button-next-about").click()
	})

	$(".custom-prev-button-gallery").on('click', function (){
		$(this).toggleClass('clicked');
		$(".custom-next-button-gallery").removeClass('clicked');
		$(".swiper-button-prev-gallery").click()
   })

	$(".custom-next-button-gallery").on('click', function (){
		$(this).toggleClass('clicked');
		$(".custom-prev-button-gallery").removeClass('clicked');
		$(".swiper-button-next-gallery").click()
	})


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




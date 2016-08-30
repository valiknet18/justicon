
if ($.browser.mobile) $('body').addClass('mobile');
if ($.browser.safari) $('body').addClass('safari');

var justicon = {};

var loading = {
	avgTime: 3000,
	trg: 1,
	state: 0,
	preloader: $('body > .preloader'),
	loaded: function () {

		if(++loading.state == loading.trg) {

			loading.status(1);
			setTimeout(loading.done, 500);

		} else {

			loading.status(loading.state / loading.trg / 1.1);

		}
	},
	status: function (mult) {

		loading.preloader.find('> .after').css({
			'width': mult * 100 + '%'
		});

	},
	done: function () {

		if (loading.finished) return;

		// TODO temp for developing
		// $('section.articles-gallery-1 > article, .article-content, .article-name, .article-date, .video, .article-page, #about-modal .content-holder').find('p, h1, h2, h3, h4, h5, h6, blockquote, span').attr('contenteditable', true).on('click', function (e) {
		// 	e.preventDefault();
		// });
		// $('.article-holder-1 a').on('click', function (e) {
		// 	e.preventDefault();
		// });

		// OWL INIT
		// $('.partners-section .owl-carousel').owlCarousel({
		// 	loop: true,
		// 	autoWidth: true
		// });
		// $('.top-news .owl-carousel').owlCarousel({
		// 	loop: true,
		// 	autoWidth: true
		// });
		$('.owl-carousel').owlCarousel({
			loop: true,
			nav:true,
			autoWidth: true
			// responsive:{
			// 	0:{
			// 		items:1
			// 	},
			// 	600:{
			// 		items:3
			// 	},
			// 	1000:{
			// 		items:4
			// 	}
			// }
		});

		// MASONRY INIT
		(function () {
			var masonrySidebarNavigation = $('#navigation-sidebar').find('.nav .inner-holder').each(function () {
				$(this).masonry({
					// columnWidth: 10,
					// gutter: 10,
					// fitWidth: true,
					// percentPosition: true,
					itemSelector: ".inner-holder > li"
				});
			});
			// cleanup news template
			$('.news-list').find('> *:not(.news-item)').remove();
			$('.news-list').masonry({
					// columnWidth: 10,
					gutter: 65,
					// fitWidth: true,
					// percentPosition: true,
					itemSelector: ".news-item"
				});
		})();
		
		setTimeout(function () {

			// WOW init
			if ($.browser.desktop) {

				new WOW().init();

			}

		}, 380);

		// hide preloader
		loading.preloader.addClass('done').animate({}).delay(400).animate({
			'opacity': 0
		}, 400, function () {

			bodyOverflow.unfixBody();

			$(window).trigger('scroll').trigger('resize');

			loading.status(0);
			$(this).detach();
			loading.finished = true;

		});

	}
};

// TODO test it
$('img').each(function () {

	if (!this.naturalWidth || true) {
		loading.trg ++;
		$(this).one('load', loading.loaded);
	}

});

setTimeout(function () {

	loading.status(1);
	setTimeout(loading.done, 100);

}, 30000);

$(window).on('load', function () {

	loading.status(1);
	setTimeout(loading.done, 200);

});

$(document).on('ready', function () {
	var $window = $(window),
		winWidth = $window.width(),
		winHeight = $window.height(),
		bodyHeight = $('body').height(),
		goUp = (function () {

			var $el = $('#to-top'),
				state = false,
				speed = 900,
				paused = false,
				plg = {
					up: function () {

						paused = true;
						state = true;

						$("html, body").stop().animate({scrollTop:0}, speed, 'swing', function () {

							paused = false;

						}).one('touchstart mousewheel DOMMouseScroll wheel', function () {

							$(this).stop(false, false).off('touchstart mousewheel DOMMouseScroll wheel');
							paused = false;

						});

						plg.hide();

					},
					show: function () {

						if (!state && !paused) {

							$el.addClass('opened');

							state = true;

						}

					},
					hide: function () {

						if (state) {

							$el.removeClass('opened');

							state = false;

						}

					},
					$el: $el
				};

			$el.on('click', function () {

				plg.up();

			});

			return plg;

	})();

		//

		// modals
		var modals = {
			opened: [],
			openModal: function ( $modal ) {

				if (!$modal.data('modal-ununique') && this.opened.length > 0) {
					modals.closeModal( this.opened[this.opened.length - 1], true );
				}
				this.opened.push( $modal );
				// $modal.addClass('opened').one( transitionPrefix, bodyOverflow.fixBody );

				$modal.off( transitionPrefix ).addClass('opened');
				bodyOverflow.fixBody();

				if ( $modal.is('[data-cross]') ) {

					this.$cross = $('<div>').addClass('cross-top-fixed animated ' + $modal.attr('data-cross') ).one('click', function () {

						modals.closeModal();

					}).one(animationPrefix, function () {

						$(this).removeClass( 'animated' );

					}).appendTo('body');

				}

			},
			closeModal: function ($modal, alt) {

				if ( this.opened.length > 0 && !$modal ) {

					for ( var y = 0; y < this.opened.length; y++ ) {

						this.closeModal( this.opened[y] );

					}

					return;

				} else if ( $modal && !($modal instanceof jQuery) ) {

					$modal = $( $modal );

				} else if ( $modal === undefined ) {

					throw 'something went wrong';

				}

				try {

					$modal
						.addClass('clothing')
						.one( animationPrefix, function () {
							$(this)
								.removeClass('opened clothing');
						});

				} catch (e) {

					console.error(e);

					this.closeModal();

					return;

				}

				this.opened.pop();

				if (!alt) {

					$modal.one( animationPrefix, bodyOverflow.unfixBody );

					try {

						if (!this.$cross) return;

						this.$cross.addClass('fadeOut').one(animationPrefix, function () {

							$(this).remove();

						});

					} catch (e) {

						console.error(e);

					}

				} else {

					try {

						this.$cross.remove();

					} catch (e) {

						console.error(e);

					}

				}

			}

		};

		$('[data-modal]').on('click', function (e) {

			e.preventDefault();

			var $self = $(this),
				target = $self.attr('data-modal'),
				$target = $(target);

			if ($target.length) {

				modals.openModal($target);

			} else {

				console.warn('Ошибка в элементе:');
				console.log(this);
				console.warn('Не найдены элементы с селектором ' + target);

			}
			
		});

		$('[data-close], .modal .close').on('click', function (e) {

			e.preventDefault();

			var $self = $(this),
				target = $self.attr('data-close'),
				$target;

			if (target) {

				$target = $(target);

				if ($target.length) {

					modals.closeModal( $target );

				}

			} else {

				modals.closeModal( $self.closest('.opened') );

			}

		});

		$('.modal').not('.fake').on('click', function (e) {

			if (e.target === this) {

				modals.closeModal( $(this) );

			}

		});

		$window.on('keyup', function (e) {

			// esc pressed
			if (e.keyCode == '27') {

				modals.closeModal();

			}

		});

		// mobile modals
		(function () {

			var level = 0,
				modals = [],
				$crossButton,
				$mobileMenu = $('#mobile-menu');

			$('[data-mobile-modal]').on('click', function (e) {

				e.preventDefault();

				$crossButton = $(this);
				var target = $crossButton.attr('data-mobile-modal'),
					$target = $(target);

				if ($target.length) {

					if ( level === 1 ) {
						bodyOverflow.unfixBody();
						$crossButton.removeClass('cross-state back-state');
						$target.addClass('clothing').one(animationPrefix, function () {
							$target.removeClass('opened clothing');
						});
						level = 0;
					} else if ( level === 0 ) {
						$crossButton.addClass('cross-state');
						$target.addClass('opened');
						if ($(document).scrollTop() < 80) {
							$('body, html').animate({
								'scrollTop': 80
							});
						}
						bodyOverflow.fixBody();
						modals[0] = $target;
						level = 1;
					} else if ( level === 2 ) {
						$crossButton.removeClass('back-state');
						modals[1]
							.addClass('clothing')
							.one(animationPrefix, function () {
								modals[1]
									.removeClass('opened clothing');
							});
						level = 1;
					} else if ( level === 3 ) {
						modals[2]
							.addClass('clothing')
							.one(animationPrefix, function () {
								modals[2]
									.removeClass('opened clothing');
							});
						level = 2;
					}

				} else {

					console.warn('Ошибка в элементе:');
					console.log(this);
					console.warn('Не найдены элементы с селектором ' + target);

				}
				
			});

			$mobileMenu.find('.wrap > ul > li > a').on('click', function (e) {

				var $submenu = $(this).siblings('.submenu');

				if ($submenu.length) e.preventDefault();

				$submenu.addClass('opened');
				$crossButton.addClass('back-state');
				modals[1] = $submenu;
				level = 2;
			});
			$mobileMenu.find('.wrap > ul > li .block-item .title').on('click', function (e) {
				var $submenu = $(this).next();
				// if ($submenu.length) e.preventDefault();

				// console.log( $submenu );

				$submenu.addClass('opened');
				$crossButton.addClass('back-state');
				modals[2] = $submenu;
				level = 3;
			});
		})();


		// shuffle array
		Array.prototype.shuffle = function() {

			for (var i = this.length - 1; i > 0; i--) {

				var num = Math.floor(Math.random() * (i + 1)),
					d = this[num];
				this[num] = this[i];
				this[i] = d;

			}

			return this;

		};

		// validation
		(function () {

			// var $profileForms = $('form');
			// $profileForms.validate();

		})();

		// wrap tables
		(function () {

			$('table').wrap('<div class="table-holder"></div>');

		})();

		// collapsing menu
		(function () {

			var $triggers = $('.accordion').find('.trigger');
			$triggers.on('click', function () {
				var $self = $(this),
					$content = $self.next(),
					openedSize;

				if (!$self.hasClass('opened')) {


					$self
						.addClass('opened');

					openedSize = getActualSizes($content).height + 20;
					console.log( openedSize );

					$content
						.addClass('opened')
						.css({
							'max-height': openedSize
						})
						.parents('.cont').each(function () {
							var $self = $(this),
								maxHeight = $self.css('max-height');
							if (maxHeight && maxHeight !== 'none') {
								$self.css('max-height', parseInt(maxHeight) + openedSize);
							}
						});

				} else {

					$self
						.removeClass('opened');
					$content
						.css({
							'max-height': ''
						})
						.removeClass('opened');

				}
			});

		})();


		// collapsing address table
		(function () {

			var $showButtons = $('.show-schedule-and-map');
			$showButtons.on('click', function () {
				var $self, $iframe, $table, fakeSrc;
				$self = $(this);
				$table = $self
					.closest('tr');
				$iframe = $table
					.find('iframe');
				fakeSrc = $iframe.attr('fake-src');

				if ($table.hasClass('opened')) {
					$table.removeClass('opened');
					$iframe.css({
						'display': 'none'
					});
				} else {
					$table.addClass('opened');
					$iframe.css({
						'display': 'initial'
					});
					if (fakeSrc) {
						$iframe.attr('src', fakeSrc);
						$iframe.attr('fake-src', '');
					}
				}
			});

		})();


		// fixed menu
		(function () {

			var status,
				$document = $(document),
				$menu = $('.menu'),
				$header = $('.header'),
				// headerHeight = $header.height(),
				headerHeight = 80,
				$sidebarNavigation = $('#navigation-sidebar');
				if ($sidebarNavigation.length === 0) {
					$sidebarNavigation = null;
				}
			$document.on('scroll', function () {
				var top = $document.scrollTop();
				if (top > headerHeight) {
					$menu.addClass('fixed');
					if ($sidebarNavigation) {
						$sidebarNavigation.css('top', 50);
					}
				} else {
					$menu.removeClass('fixed');
					if ($sidebarNavigation) {
						$sidebarNavigation.css('top', 130 - top);
					}
				}
			});
			// .on('resize', function () {
			// 	headerHeight = $header.height();
			// });

		})();

		// sidebar navigation
		(function () {

			var state = [],
				$body = $('body'),
				$sidebar = $('#navigation-sidebar'),
				$nav = $sidebar.find('.nav'),
				$mainNav = $('body').find('> .menu'),
				$servicesLink = $mainNav.find('ul > li:nth-child(2)'),
				$submenuTriggers = $nav.find('> li > a'),
				$toggleNavCollapse = $sidebar.find('.toggle-nav-collapse');

			$toggleNavCollapse.on('click', function (e) {

				e.preventDefault();

				if (state.length) {

					for (var i = state.length - 1; i >= 0; i--) {
						state[i].removeClass('opened');
					}

					state = [];

					bodyOverflow.unfixBody();

				}

				$submenuTriggers
					.removeClass('active');

				$sidebar
					.toggleClass('expanded')
					.removeClass('opened');
				$servicesLink.removeClass('opened');

				if ($sidebar.hasClass('expanded')) {
					$body
						.addClass('sidebar-opened');
					$servicesLink.addClass('opened');
				} else {
					$body
						.removeClass('sidebar-opened');
					// $servicesLink.removeClass('opened');
				}
			});

			$servicesLink.on('click', function (e) {
				e.preventDefault();
				if (state.length) {

					for (var i = state.length - 1; i >= 0; i--) {
						state[i].removeClass('opened');
					}

					state = [];

					$submenuTriggers
						.removeClass('active');

					$sidebar
						.addClass('expanded')
						.removeClass('opened');

					$body
						.addClass('sidebar-opened');
					$servicesLink.addClass('opened');

					bodyOverflow.unfixBody();

				} else {

					$sidebar
						.toggleClass('expanded')
						.removeClass('opened');

					if ($sidebar.hasClass('expanded')) {
						$body
							.addClass('sidebar-opened');
						$servicesLink.addClass('opened');
					} else {
						$body
							.removeClass('sidebar-opened');
						$servicesLink.removeClass('opened');
					}

				}
			});


			$submenuTriggers.on('click', function (e) {
				e.preventDefault();

				var $self = $(this),
					$active = $self
						.siblings('.submenu');

				// remove old actives
				if (state.length) {

					for (var i = state.length - 1; i >= 0; i--) {
						state[i].removeClass('opened');
					}

					state = [];

					bodyOverflow.unfixBody();

				} else {
					
					if ($(document).scrollTop() < 80) {
						$('body, html').animate({
							'scrollTop': 80
						});
					}

				}

				if ($self.hasClass('active')) {

					$submenuTriggers
						.removeClass('active');

					$sidebar.removeClass('opened');

					return;
				}

				if ($active.length) {

					$submenuTriggers
						.removeClass('active');

					$active
						.addClass('opened')
						.find('.inner-holder')
						.masonry('reloadItems')
						.masonry('layout');

					$sidebar.one(transitionPrefix, function () {
						$active
							.find('.inner-holder')
							.masonry('layout');
					});

					$self
						.addClass('active');

					$sidebar.addClass('expanded opened');

					$body
						.addClass('sidebar-opened');

					bodyOverflow.fixBody();

					state.push(
						$active
					);

				} else {

					$sidebar.removeClass('opened');

					$body
						.removeClass('sidebar-opened');

					$submenuTriggers
						.removeClass('active');

				}

				//
				// $sidebar.addClass('opened expanded');

			});
			// 	headerHeight = $header.height();
			// });

		})();


		// partners modal
		(function () {

			var $partners = $('#cl-in').find('.cl-item');
			$partners.each(function () {
				var $self = $(this),
					$tabs = $self.find('.cltab'),
					$tabBtns = $self.find('.cltabs > *');
				$tabBtns.each(function (i) {
					var $self = $(this);
					$self.on('click', function () {
						$self
							.addClass('clact')
							.siblings()
							.removeClass('clact');
						$tabs
							.eq(i)
							.addClass('active')
							.siblings()
							.removeClass('active');
					});
				});
				$tabs.each(function (i) {
					var $tab = $(this);
					if (i === 0) {
						$tab.addClass('active');
					}
					// modal image
					$tab.find('img').on('click', function () {

						var $body = $('body'),
							$target = $(this),
							$clone = $target.clone(),
							origTop = $target.offset().top,
							origLeft = $target.offset().left,
							origWidth = $target.width(),
							origHeight = $target.height();

						var closeModal = function () {

								$tint.removeClass('active');
								$clone.css( stylesStack ).one(transitionPrefix, function () {

									$clone.off().remove();
									$tint.off().remove();

								});

							};

						var stylesStack = {
								'position': 'fixed',
								'z-index': '20',
								'transform': 'scale(1)',
								'opacity': 0,
								'left': origLeft,
								'top': origTop,
								'height': origHeight,
								'width': origWidth
							},
							$tint = $('<div>')
								.addClass('tint')
								.one('DOMMouseScroll wheel mousewheel touchstart click', closeModal)
								.appendTo( $body );

						var stylesTarget = {
							'transform': 'scale(1) translate(-50%, -50%)',
							'-webkit-transform': 'scale(1) translate(-50%, -50%)',
							'opacity': 1,
							'left': '50%',
							'top': '50%',
							'height': this.naturalHeight,
							'width': this.naturalWidth
						};

						if (this.naturalWidth > winWidth / 1.5) {

							var ratio = this.naturalWidth / this.naturalHeight;
							stylesTarget.width = winWidth / 1.5;
							stylesTarget.height = stylesTarget.width / ratio;

						}

						$clone
							.addClass( 'modal-image' )
							.css( stylesStack )
							.one('DOMMouseScroll wheel mousewheel touchstart click', closeModal)
							.appendTo( $body );

						setTimeout(function () {

							$clone.css( stylesTarget );
							$tint.addClass('active');

						}, 20);

					});
				});
			});
			$partners.on('click', function (e) {
				var $self = $(this),
					$target = $(e.target),
					$modal = $self.find('.modal-cl');
				if ($self.hasClass('opened')) {
					if (!($target.hasClass('modal-cl') || $target.hasClass('close'))) return;
					$self.removeClass('opened');
					bodyOverflow.unfixBody();
				} else {
					$self.addClass('opened');
					bodyOverflow.fixBody();
				}
			});

		})();


		// scroll
		// $(document).on('scroll', function () {

		// 	var top = $(this).scrollTop();

		// });

		// resize
		$window.on('resize', function () {

			winWidth = $window.width();
			winHeight = $window.height();
			bodyHeight = $('body').height();

		});

});

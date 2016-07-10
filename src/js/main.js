
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


		// init main-slider
		// $('.caroufredsel_wrapper').simpleSlider({
		// 	'holderClass': '.carousel',
		// 	'slideClass': '.item'
		// });

		$('.top-news-holder').groupSlider({
			'loop': false,
			'mouseDrug': false,
			'mouseWheel': false,
			'nextClass': 'next-slide',
			'padding': 40,
			'pageClass': 'page',
			'pagination': false,
			'preloaderClass': 'preloader',
			'prevClass': 'prev-slide',
			'screenMaxWidth': 2000,
			'slideClass': 'slide',
			'slideNameSpinner': false,
			'slideNamesHolderClass': 'names-holder',
			'slideNameClass': 'part',
			'slidesHolderClass': 'parnters-container',
			'slidesOnPage': 1,
			'speed': 400,
			'touch': true,
			'viewportClass': 'caroufredsel'
		});

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

		$('[data-close]').on('click', function (e) {

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

		$('.modal-holder').not('.fake').on('click', function (e) {

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

					openedSize = getActualSizes($content).height;

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

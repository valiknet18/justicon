var _pogorelov = {};
var animationPrefix = (function () {
	var t,
	el = document.createElement("fakeelement");
	var transitions = {
		"WebkitTransition": "webkitAnimationEnd",
		"OTransition": "oAnimationEnd",
		"MozTransition": "animationend",
		"transition": "animationend"
	};
	for (t in transitions) {

		if (el.style[t] !== undefined) {

			return transitions[t];

		}

	}
})(),
transitionPrefix = (function () {
	var t,
	el = document.createElement("fakeelement");
	var transitions = {
		"WebkitTransition": "webkitTransitionEnd",
		"transition": "transitionend",
		"OTransition": "oTransitionEnd",
		"MozTransition": "transitionend"
	};
	for (t in transitions) {

		if (el.style[t] !== undefined) {

			return transitions[t];

		}

	}
})(),
requestAnimFrame = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
function( callback ){
	window.setTimeout( callback, 1000 / 60 );
},
bodyOverflow = (function () {
	var $body = $('body'),
		$mainNavigation = $('.main-navigation');
	return {
		fixBody: function () {

			$body.width( $body.width() )
				.addClass('fixed');

			$mainNavigation.width( $body.width() - 80 );

		},
		unfixBody: function () {

			$body
				.css({
					'width': 'auto'
				})
				.removeClass('fixed');

			$mainNavigation.width('');

		},
		resize: function () {

			this.unfixBody();

		}.bind(this)
	};
})(),
getActualSizes = (function ($) {
	var tempStylesObject = {
			'display': 'block',
			'position': 'absolute',
			'max-height': 'initial',
			'visibility': 'hidden'
		};
	return function ($el, attr) {
		var $clone = $el.clone(),
			result = {
				'height': 0,
				'width': 0
			};

		$clone
			.attr('style', '')
			.addClass('opened')
			.css(tempStylesObject)
			.css({
				'width': $el.width()
			})
			.insertAfter( $el );

		result.height = $clone.height();
		result.width = $clone.width();

		// console.log( $clone );

		$clone.remove();

		return result;
	}
})(jQuery);

(function ($) {

$.fn.validate = function (opt) {

	this.each(function (i) {

		var DOM = {},
			state = {},
			$self = $(this);

		// options
		if (!opt) {
			opt = {};
		}
		opt = $.extend({
		}, opt);

		// methods
		var plg = {
			init: function () {

				DOM.$fields = $self.find('[data-validate]');
				$self.find('[type="submit"]').on('click', plg.submit);
				DOM.$fields.on('focus', function () {
					plg.removeLabel( $(this) );
				});

			},
			test: function (data, type) {

				switch (type) {
					case 'name':
						return /^[а-яА-Яa-zA-Z\-]+\s{0,1}[а-яА-Яa-zA-Z\-]{0,}$/.test(data);
					case 'phone':
						return /^[\(\)0-9\-\s\+]{8,}/.test(data);
					case 'email':
						return /^[0-9a-zA-Z._-]+@[0-9a-zA-Z_-]+\.[a-zA-Z._-]+/.test(data);
					default:
						return true;
				}

			},
			addLabel: function ($el) {

				$el.parent().addClass('error');

			},
			removeLabel: function ($el) {

				$el.parent().removeClass('error');

			},
			validate: function ($el) {

				if ( $el.hasClass('skip') ) return;

				if ( plg.test( $el.val(), $el.data('validate') ) ) {

					plg.removeLabel( $el );

				} else {

					plg.addLabel( $el );
					state.errors++;

				}

			},
			submit: function (e) {

				state.errors = 0;
				DOM.$fields.each( function () {

					plg.validate( $(this) );

				} );

				if (state.errors) {

					e.preventDefault();

				}

			}

		};

		plg.init();

		return plg;

	});

};


})(jQuery);
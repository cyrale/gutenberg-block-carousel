( function( $ ) {
	$( function() {
		$( '.wp-block-gutenberg-block-carousel .carousel' ).each( function( index, carousel ) {
			var $carousel = $( carousel );

			$carousel.owlCarousel( {
				items: 1,
				lazyLoad: true,
			} );
		} );
	} );
}( jQuery ) );

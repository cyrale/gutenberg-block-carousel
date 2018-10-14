<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Gutenberg_Block_Carousel
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function gutenberg_block_carousel_block_assets() {
	// Scripts.
	wp_enqueue_script(
		'owl.carousel',
		'https://cdn.jsdelivr.net/npm/owl.carousel@2.3.4/dist/owl.carousel.min.js',
		[ 'jquery' ],
		'2.3.4',
		true
	);

	wp_enqueue_script(
		'gutenberg-block-carousel-app-js',
		plugins_url( 'dist/app.min.js', dirname( __FILE__ ) ),
		[ 'owl.carousel', 'jquery' ],
		substr( sha1( filemtime( plugin_dir_path( __DIR__ ) . 'dist/app.min.js' ) ), 0, 8 ),
		true
	);


	// Styles.
	wp_enqueue_style(
		'owl.carousel',
		'https://cdn.jsdelivr.net/npm/owl.carousel@2.3.4/dist/assets/owl.carousel.min.css',
		[],
		'2.3.4'
	);

	wp_enqueue_style(
		'owl.theme.default',
		'https://cdn.jsdelivr.net/npm/owl.carousel@2.3.4/dist/assets/owl.theme.default.min.css',
		[],
		'2.3.4'
	);

	wp_enqueue_style(
		'gutenberg-block-carousel-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		[ 'wp-blocks', 'owl.carousel' ], // Dependency to include the CSS after it.
		substr( sha1( filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) ), 0, 8 )
	);
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'gutenberg_block_carousel_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function gutenberg_block_carousel_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'owl.carousel',
		'https://cdn.jsdelivr.net/npm/owl.carousel@2.3.4/dist/owl.carousel.min.js',
		[ 'jquery' ],
		'2.3.4',
		true
	);

	wp_enqueue_script(
		'gutenberg-block-carousel-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		[ 'wp-blocks', 'wp-i18n', 'wp-element' ], // Dependencies, defined above.
		substr( sha1( filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ) ), 0, 8 ),
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'gutenberg-block-carousel-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		[ 'wp-edit-blocks' ], // Dependency to include the CSS after it.
		substr( sha1( filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) ), 0, 8 )
	);
} // End function gutenberg_block_carousel_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'gutenberg_block_carousel_editor_assets' );

/**
 * Add the current block in the white list.
 *
 * @param array $blocks White listed blocks.
 *
 * @return array New list with the current block inside.
 */
function gutenberg_block_carousel_default_blocks( $blocks ) {
	if ( ! in_array( 'gutenberg-block/carousel', $blocks, true ) ) {
		$blocks[] = 'gutenberg-block/carousel';
	}

	return $blocks;
}

// Hook: Default blocks.
add_filter( 'gutenberg_basics_default_blocks', 'gutenberg_block_carousel_default_blocks' );

/**
 * Define image sizes.
 */
function gutenberg_block_carousel_define_image_sizes() {
	$crop_images = apply_filters( 'gutenberg_block_carousel_crop_images', true );
	$image_sizes = apply_filters( 'gutenberg_block_carousel_image_sizes', [
		'thumbnail' => [
			'width'  => 640,
			'height' => 480,
			'crop'   => $crop_images,
		],
	] );

	foreach ($image_sizes as $name => $size ) {
		add_image_size( "block-carousel-{$name}", $size['width'], $size['height'], $size['crop'] );
	}
}

// Hook: After setup theme.
add_action( 'after_setup_theme', 'gutenberg_block_carousel_define_image_sizes' );

/**
 * Allow to save specific HTML attributes.
 *
 * @param array        $allowed Allowed HTML attributes.
 * @param array|string $context Context to judge allowed tags by.
 *
 * @return array New allowed HTML attributes
 */
function gutenberg_block_carousel_kses_allowed_html( $allowed, $context ) {
	if ( is_array( $context ) ) {
		return $allowed;
	}

	if ( $context === 'post' ) {
		$allowed['img']['data-src'] = true;
		$allowed['img']['data-lightbox-src'] = true;
	}

	return $allowed;
}

// Hook: Allow HTML.
add_filter( 'wp_kses_allowed_html', 'gutenberg_block_carousel_kses_allowed_html', 20, 2 );

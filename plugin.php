<?php
/**
 * Plugin Name: Gutenberg Block - Carousel
 * Plugin URI:  https://github.com/cyrale/gutenberg-block-carousel
 * Description:
 * Version:     1.0.0
 * Author:      Cyrale
 * Author URI:  https://github.com/cyrale
 * Donate link: https://github.com/cyrale/gutenberg-block-carousel
 * License:     GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: gutenberg-block-carousel
 * Domain Path: /languages
 *
 * @link    https://github.com/cyrale/gutenberg-block-carousel
 *
 * @package Gutenberg_Block_Carousel
 * @version 1.0.0
 *
 * Built using create-guten-block (https://github.com/ahmadawais/create-guten-block)
 */

/**
 * Copyright (c) 2018 Cyrale (email : cyril@jacquesson.me)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Use composer autoload.
if ( ! class_exists( 'Puc_v4_Factory' ) && file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';

// Update checker.
Puc_v4_Factory::buildUpdateChecker(
	'https://github.com/cyrale/gutenberg-block-carousel',
	__FILE__,
	'gutenberg-block-carousel'
);

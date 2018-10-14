/**
 * BLOCK: gutenberg-block-carousel
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { RichText } = wp.editor;

import edit from './block-edit';

export const name = 'gutenberg-block/carousel';

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( name, {
	title: __( 'Carousel' ),

	icon: (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path fill="none" d="M0 0h24v24H0V0z" />
			<path d="M2 6h4v11H2zm5 13h10V4H7v15zM9 6h6v11H9V6zm9 0h4v11h-4z" />
		</svg>
	),

	category: 'layout',

	keywords: [ __( 'Carousel' ), __( 'Image' ), __( 'Layout' ) ],

	supports: {
		html: false,
	},

	attributes: {
		images: {
			type: 'array',
			default: [],
			source: 'query',
			selector: '.wp-block-gutenberg-block-carousel .carousel .carousel__item',
			query: {
				url: {
					source: 'attribute',
					selector: 'img',
					attribute: 'data-src',
				},
				alt: {
					source: 'attribute',
					selector: 'img',
					attribute: 'alt',
					default: '',
				},
				id: {
					source: 'attribute',
					selector: 'img',
					attribute: 'data-id',
				},
				lightbox: {
					source: 'attribute',
					selector: 'img',
					attribute: 'data-lightbox-src',
				},
				caption: {
					source: 'html',
					selector: 'figcaption',
				},
			},
		},
		settings: {
			type: 'object',
		},
		items: {
			type: 'number',
		},
		thumbnailSize: {
			type: 'string',
			default: 'block-carousel-thumbnail',
		},
		lightboxSize: {
			type: 'string',
			default: 'full',
		},
		align: {
			type: 'string',
		},
	},

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		const props = {};

		if ( 'full' === align || 'wide' === align ) {
			props[ 'data-align' ] = align;
		}

		return props;
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {object} props - Properties.
	 *
	 * @return {Component} Rendered component.
	 */
	edit,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {object} props - Properties.
	 *
	 * @return {Component} Rendered component.
	 */
	save: ( { attributes: { images, align } } ) => {
		return (
			<div className="carousel-container" data-align={ align }>
				<div className="carousel owl-carousel owl-theme">
					{ images.map( image => (
						<div className="carousel__item" key={ image.id || image.url }>
							<figure>
								<img
									className="carousel__image owl-lazy"
									alt={ image.alt }
									data-id={ image.id }
									data-src={ image.url }
									data-lightbox-src={ image.lightbox }
								/>
								{ image.caption &&
									image.caption.length > 0 && (
									<RichText.Content tagName="figcaption" value={ image.caption } />
								) }
							</figure>
						</div>
					) ) }
				</div>
			</div>
		);
	},
} );

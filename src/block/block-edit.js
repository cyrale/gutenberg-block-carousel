/**
 * External dependencies
 */
import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import startCase from 'lodash/startCase';
import uniq from 'lodash/uniq';

/**
 * Internal dependencies
 */
import CarouselImage from './carousel-image';

/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { __ } = wp.i18n;
const { IconButton, FormFileUpload, PanelBody, RangeControl, SelectControl, Toolbar, withNotices } = wp.components;
const {
	BlockAlignmentToolbar,
	BlockControls,
	MediaUpload,
	MediaPlaceholder,
	InspectorControls,
	RichText,
	mediaUpload,
} = wp.editor;

const MAX_ITEMS = 8;

export function defaultItemsNumber( attributes ) {
	return Math.min( 3, attributes.images.length );
}

class BlockEdit extends Component {
	constructor( props ) {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onSelectImages = this.onSelectImages.bind( this );
		this.setItemsNumber = this.setItemsNumber.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
		this.setThumbnailSize = this.setThumbnailSize.bind( this );
		this.setLightboxSize = this.setLightboxSize.bind( this );
		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.addFiles = this.addFiles.bind( this );
		this.uploadFromFiles = this.uploadFromFiles.bind( this );

		this.state = {
			selectedImage: null,
			thumbnailSize: props.thumbnailSize,
			lightboxSize: props.lightboxSize,
			carouselInitialized: false,
		};
	}

	onSelectImage( index ) {
		return () => {
			if ( this.state.selectedImage !== index ) {
				this.setState( {
					selectedImage: index,
					updateSize: true,
				} );
			}
		};
	}

	onRemoveImage( index ) {
		return () => {
			const images = filter( this.props.attributes.images, ( image, i ) => index !== i );
			const { items } = this.props.attributes;
			this.setState( { selectedImage: null } );
			this.props.setAttributes( {
				images,
				items: items ? Math.min( images.length, items ) : items,
			} );
		};
	}

	onSelectImages( images ) {
		this.props.setAttributes( {
			images: images.map( image => pick( image, [ 'alt', 'caption', 'id', 'url' ] ) ),
		} );
	}

	setItemsNumber( value ) {
		this.props.setAttributes( { items: value } );
	}

	setThumbnailSize( value ) {
		this.props.setAttributes( { thumbnailSize: value } );
		this.setState( { thumbnailSize: value, updateSize: true } );
	}

	setLightboxSize( value ) {
		this.props.setAttributes( { lightboxSize: value } );
		this.setState( { lightboxSize: value, updateSize: true } );
	}

	setImageAttributes( index, attributes ) {
		const {
			attributes: { images },
			setAttributes,
		} = this.props;
		if ( ! images[ index ] ) {
			return;
		}
		setAttributes( {
			images: [
				...images.slice( 0, index ),
				{
					...images[ index ],
					...attributes,
				},
				...images.slice( index + 1 ),
			],
		} );
	}

	uploadFromFiles( event ) {
		this.addFiles( event.target.files );
	}

	addFiles( files ) {
		const currentImages = this.props.attributes.images || [];
		const { noticeOperations, setAttributes } = this.props;
		mediaUpload( {
			allowedType: 'image',
			filesList: files,
			onFileChange: images => {
				setAttributes( {
					images: currentImages.concat( images ),
				} );
			},
			onError: noticeOperations.createErrorNotice,
		} );
	}

	getAvailableSizes() {
		if ( this.props.images.length === 0 ) {
			return [];
		}

		const sizes = [];

		this.props.images.map( image => {
			forEach( get( image, [ 'media_details', 'sizes' ], {} ), ( size, name ) => {
				if ( ! /_old_[0-9]+x[0-9]+$/.test( name ) ) {
					sizes.push( name );
				}
			} );
		} );

		return uniq( sizes );
	}

	componentDidUpdate( prevProps ) {
		const {
			attributes: { images, thumbnailSize, lightboxSize },
			isSelected,
			setAttributes,
		} = this.props;

		if ( this.state.updateSize || ( ! isSelected && prevProps.isSelected ) ) {
			setAttributes( {
				images: images.map( image => {
					const sizes = get(
						find( this.props.images, { id: Number( image.id ) } ),
						[ 'media_details', 'sizes' ],
						{}
					);
					const imgURL = image.url ? image.url : sizes.full.source_url;

					image.url = sizes[ thumbnailSize ] ? sizes[ thumbnailSize ].source_url : imgURL;
					image.lightbox = sizes[ lightboxSize ] ? sizes[ lightboxSize ].source_url : imgURL;

					return image;
				} ),
			} );

			this.setState( {
				updateSize: false,
			} );
		}

		// Deselect images when deselecting the block
		if ( ! isSelected && prevProps.isSelected ) {
			this.setState( {
				selectedImage: null,
				captionSelected: false,
			} );
		}

		// Initialize own.Carousel
		if ( ( ! isSelected && prevProps.isSelected ) || ! this.state.carouselInitialized ) {
			window.jQuery( '.wp-block-gutenberg-block-carousel .carousel:not(.carousel--editor)' ).each( ( index, item ) => {
				window.jQuery( item ).owlCarousel( {
					items: 1,
				} );
			} );

			this.setState( {
				carouselInitialized: true,
			} );
		}
	}

	render() {
		const { attributes, className, isSelected, setAttributes, noticeOperations, noticeUI } = this.props;
		const { images, items = defaultItemsNumber( attributes ), thumbnailSize, lightboxSize, align } = attributes;
		const availableSizes = this.getAvailableSizes();

		const inspector = (
			<InspectorControls>
				{ !! images.length && (
					<PanelBody title={ __( 'Carousel Settings' ) }>
						{ ! isEmpty( availableSizes ) && (
							<Fragment>
								<SelectControl
									label={ __( 'Thumbnail Size' ) }
									value={ thumbnailSize }
									options={ availableSizes.map( sizeName => ( {
										value: sizeName,
										label: startCase( sizeName ),
									} ) ) }
									onChange={ this.setThumbnailSize }
								/>
								<SelectControl
									label={ __( 'Lightbox Size' ) }
									value={ lightboxSize }
									options={ availableSizes.map( sizeName => ( {
										value: sizeName,
										label: startCase( sizeName ),
									} ) ) }
									onChange={ this.setLightboxSize }
								/>
							</Fragment>
						) }
						<RangeControl
							label={ __( 'Items' ) }
							value={ items }
							onChange={ this.setItemsNumber }
							min={ 1 }
							max={ Math.min( MAX_ITEMS, images.length ) }
						/>
					</PanelBody>
				) }
			</InspectorControls>
		);

		const controls = (
			<BlockControls>
				<BlockAlignmentToolbar
					controls={ [ 'wide', 'full' ] }
					value={ align }
					onChange={ newAlign => setAttributes( { align: newAlign } ) }
				/>
				{ !! images.length && (
					<Toolbar>
						<MediaUpload
							onSelect={ this.onSelectImages }
							type="image"
							multiple
							gallery
							value={ images.map( image => image.id ) }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Edit Carousel' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				) }
			</BlockControls>
		);

		if ( images.length === 0 ) {
			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon="format-gallery"
						className={ className }
						labels={ {
							title: __( 'Gallery' ),
							name: __( 'images' ),
						} }
						onSelect={ this.onSelectImages }
						accept="image/*"
						type="image"
						multiple
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ inspector }
				{ controls }
				{ noticeUI }
				<div className={ `${ className } carousel-container` } data-align={ align }>
					{ ! isSelected && (
						<div className="carousel owl-carousel">
							{ images.map( image => (
								<div className="carousel__item" key={ image.id || image.url }>
									<figure>
										<img
											className="carousel__image"
											src={ image.url }
											alt={ image.alt }
											data-id={ image.id }
										/>
										{ image.caption &&
											image.caption.length > 0 && (
											<RichText.Content tagName="figcaption" value={ image.caption } />
										) }
									</figure>
								</div>
							) ) }
						</div>
					) }
					{ isSelected && (
						<Fragment>
							<div className={ `carousel carousel--editor items-${ items }` }>
								{ images.map( ( image, index ) => (
									<div className="carousel__item" key={ image.id || image.url }>
										<CarouselImage
											url={ image.url }
											alt={ image.alt }
											id={ image.id }
											isSelected={ isSelected && this.state.selectedImage === index }
											onRemove={ this.onRemoveImage( index ) }
											onSelect={ this.onSelectImage( index ) }
											setAttributes={ attrs => this.setImageAttributes( index, attrs ) }
											caption={ image.caption }
										/>
									</div>
								) ) }
							</div>
							<div className="carousel__add-item-button-container">
								<FormFileUpload
									multiple
									isLarge
									className="carousel__add-item-button"
									onChange={ this.uploadFromFiles }
									accept="image/*"
									icon="insert"
								>
									{ __( 'Upload an image' ) }
								</FormFileUpload>
							</div>
						</Fragment>
					) }
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );

		return {
			images: props.attributes.images.map( image => ( image.id ? getMedia( image.id ) : null ) ),
		};
	} ),
	withNotices,
] )( BlockEdit );

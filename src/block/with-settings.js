/**
 * WordPress dependencies
 */
const { Component } = wp.element;

export default function withSettings( WrappedComponent ) {
	return class extends Component {
		constructor( props ) {
			super( props );

			this.state = {
				settings: window.gutenbergBlockCarouselDefaultSettings || {},
			};
		}

		render() {
			return <WrappedComponent { ...this.state } { ...this.props } />;
		}
	};
}

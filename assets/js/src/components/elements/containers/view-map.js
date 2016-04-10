/**
 * Tailor.Views.TailorMap
 *
 * Map element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
	MapView;

MapView = ContainerView.extend( {

    childViewContainer : '.tailor-tabs__content',

	onDomRefresh : function() {
		if ( this.children.length == 0 ) {
			this._isReady = true;
			this.triggerAll( 'element:ready', this );
		}
	}

} );

module.exports = MapView;
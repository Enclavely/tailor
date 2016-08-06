/**
 * Tailor.Views.TailorSection
 *
 * Section element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
	SectionView;

SectionView = ContainerView.extend( {

	attributes : {
		draggable : true
	},

    modelEvents : {
        'change:atts' : 'onChangeAttributes',
        'change:order' : 'onChangeOrder'
    },

    childViewContainer : '.tailor-section__content',

	onChangeOrder : function() {
		jQuery( window ).trigger( 'resize' );
	}

} );

module.exports = SectionView;
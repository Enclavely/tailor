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
        'change:atts' : 'onChangeAttributes'
    },

    childViewContainer : '.tailor-section__content'

} );

module.exports = SectionView;
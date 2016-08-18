var ContainerView = require( './../element-container' ),
	SectionView;

SectionView = ContainerView.extend( {

	attributes : {
		draggable : true
	},

    modelEvents : {
        'change:atts' : 'onChangeAttributes',
        'change:order' : 'onChangeOrder',
        'change:setting' : 'onChangeSetting'
    },

    childViewContainer : '.tailor-section__content',

	onChangeOrder : function() {
		jQuery( window ).trigger( 'resize' );
	}

} );

module.exports = SectionView;
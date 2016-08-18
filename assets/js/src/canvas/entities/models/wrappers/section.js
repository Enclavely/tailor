var WrapperModel = require( './../element-wrapper' ),
    SectionModel;

SectionModel = WrapperModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        return 'tailor_section' == that.get( 'tag' ) && ! _.contains( [ 'left', 'right', 'center' ], region );
    }

} );

module.exports = SectionModel;
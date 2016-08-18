var ContainerModel = require( './../element-container' ),
    RowModel;

RowModel = ContainerModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'child' == that.get( 'type' ) || 'tailor_section' == that.get( 'tag' ) || 'center' == region ) {
            return false;
        }

        return _.contains( [ 'top', 'bottom' ], region ) && 'tailor_column' != that.get( 'tag' );
    }

} );

module.exports = RowModel;
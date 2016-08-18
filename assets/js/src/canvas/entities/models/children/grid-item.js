var ChildModel = require( './../element-child' ),
    GridItemModel;

GridItemModel = ChildModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'tailor_section' == that.get( 'tag' ) || _.contains( [ 'top', 'bottom', 'center' ], region ) ) {
            return false;
        }

        var parent = this.collection.getParent( this );
        if ( parent.get( 'tag' ) == that.get( 'tag' ) ) {
            return false;
        }

        return that.get( 'tag' ) == this.get( 'tag' );
    }

} );

module.exports = GridItemModel;
var ChildModel = require( './../element-child' ),
    ColumnModel;

ColumnModel = ChildModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( _.contains( [ 'tailor_section', 'tailor_row' ], that.get( 'tag' ) ) || ! _.contains( [ 'left', 'right' ], region ) ) {
            return false;
        }
        if ( 'child' == that.get( 'type' ) && that.get( 'tag' ) != this.get( 'tag' ) ) {
            return false;
        }
        var siblings = this.collection.getSiblings( this );
        return that.get( 'parent' ) == this.get( 'parent' ) || siblings.length < 6;
    }

} );

module.exports = ColumnModel;
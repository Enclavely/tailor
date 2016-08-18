var CompositeModel = require( './element-composite' ),
    ContainerModel;

ContainerModel = CompositeModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'child' == that.get( 'type' ) || _.contains( [ 'tailor_section', 'tailor_column' ], that.get( 'tag' ) ) ) {
            return false;
        }

        var parent = this.collection.getParent( this );
        if ( 'tailor_row' == that.get( 'tag' ) ) {
            return 'tailor_section' == parent.get( 'tag' ) && _.contains( [ 'top', 'bottom' ], region );
        }
        if ( 'center' == region ) {
            return 'container' != that.get( 'type' );
        }
        if ( _.contains( [ 'wrapper', 'child' ], parent.get( 'type' ) ) ) {

            if ( _.contains( [ 'top', 'bottom' ], region ) ) {
                return _.contains( [ 'tailor_section', 'tailor_column' ], parent.get( 'tag' ) ) || ! _.contains( [ 'container', 'wrapper', 'child' ], that.get( 'type' ) );
            }

            return 'tailor_section' == parent.get( 'tag' ) || ! _.contains( [ 'left', 'right' ], region );
        }

        return 'container' != that.get( 'type' );
    },

    /**
     * Initializes the tabs model.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'element:move:top', this.insertBefore );
        this.listenTo( this, 'element:move:bottom', this.insertAfter );
        this.listenTo( this, 'element:move:left', this.columnBefore );
        this.listenTo( this, 'element:move:right', this.columnAfter );

        this.listenTo( this, 'element:copy:top', this.copyBefore );
        this.listenTo( this, 'element:copy:bottom', this.copyAfter );
        this.listenTo( this, 'element:copy:left', this.copyColumnBefore );
        this.listenTo( this, 'element:copy:right', this.copyColumnAfter );
    }

} );

module.exports = ContainerModel;
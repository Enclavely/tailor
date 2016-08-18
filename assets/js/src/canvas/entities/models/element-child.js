var CompositeModel = require( './element-composite' ),
    ChildModel;

ChildModel = CompositeModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'tailor_section' == that.get( 'tag' ) || _.contains( [ 'left', 'right', 'center' ], region ) ) {
            return false;
        }

        var parent = this.collection.getParent( this );
        if ( parent.get( 'tag' ) == that.get( 'tag' ) ) {
            return false;
        }

        return that.get( 'tag' ) == this.get( 'tag' );
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
        this.listenTo( this, 'element:move:left', this.insertBefore ); // Column
        this.listenTo( this, 'element:move:right', this.insertAfter ); // Column

        this.listenTo( this, 'element:copy:top', this.copyBefore );
        this.listenTo( this, 'element:copy:bottom', this.copyAfter );
        this.listenTo( this, 'element:copy:left', this.copyBefore ); // Column
        this.listenTo( this, 'element:copy:right', this.copyAfter ); // Column
    }

} );

module.exports = ChildModel;
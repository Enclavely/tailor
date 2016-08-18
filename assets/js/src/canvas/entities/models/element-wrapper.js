var CompositeModel = require( './element-composite' ),
    WrapperModel;

WrapperModel = CompositeModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'child' == that.get( 'type' ) || _.contains( [ 'tailor_section', 'tailor_column' ], that.get( 'tag' ) ) || 'center' == region ) {
            return false;
        }

        var parent = this.collection.getParent( this );
        if ( 'tailor_row' == that.get( 'tag' ) ) {
            return 'tailor_section' == parent.get( 'tag' ) && _.contains( [ 'top', 'bottom' ], region );
        }
        if ( 'child' == parent.get( 'type' ) && 'tailor_column' != parent.get( 'tag' ) ) {
            return 'container' != that.get( 'type' ) && ! _.contains( [ 'left', 'right' ], region );
        }
        if ( _.contains( [ 'container', 'wrapper', 'child' ], parent.get( 'type' ) ) ) {
            return 'tailor_section' == parent.get( 'tag' ) || ! _.contains( [ 'left', 'right' ], region );
        }

        return true;
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

        this.listenTo( this, 'element:move:center', this.createChild );
        this.listenTo( this, 'element:copy:center', this.copyChild );
    },

    /**
     * Inserts the source element inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    createChild : function( targetView, sourceView ) {
        var id = targetView.model.get( 'id' );
        var childTag = targetView.model.get( 'child' );
        var numberChildren = this.collection.where( { parent : id, tag : childTag } ).length;

        this.createTemplate( sourceView.model.get( 'id' ), sourceView );
        this.collection.createWrapper( childTag, id, numberChildren, sourceView.model );
    },

    /**
     * Copies the source element and inserts it inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyChild : function( targetView, sourceView ) {
        var id = targetView.model.get( 'id' );
        var childTag = targetView.model.get( 'child' );
        var numberChildren = this.collection.where( { parent : id, tag : childTag } ).length;
        var wrapper = this.collection.createWrapper( childTag, id, numberChildren, false );

        this.cloneContainer( sourceView, wrapper.get( 'id' ), 0 );
    }

} );

module.exports = WrapperModel;
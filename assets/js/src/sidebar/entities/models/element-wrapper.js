var WrapperModel = Backbone.Model.extend( {

    /**
     * The default model parameters.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {

        return {
            label : '',
            description : '',
            tag : '',
            icon : '',
            sections : [],
            controls : [],
            type : 'default',
            child : '',
            collection : 'library'
        };
    },

    /**
     * Initializes the model.
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
        this.listenTo( this, 'element:add:center', this.createChild );
    },

    /**
     * Creates and inserts an element before the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) - 1 );
    },

    /**
     * Creates and inserts an element after the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates a new wrapper element at the given position.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     */
    insertAtIndex : function( model, index ) {
        model.collection.createWrapper( this.get( 'tag' ), model.get( 'parent' ), index );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );
        var index = view.model.get( 'order' ) - 1;
        var tag = 'tailor_content';

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, index );
            view.model.collection.createWrapper( this.get( 'tag' ), column.get( 'id' ), 0 );
        }
        else {

            var columns = view.model.collection.createRow( parentId, index );
            view.model.collection.insertChild( view.model, _.last( columns ) );
            view.model.collection.createWrapper( this.get( 'tag' ), _.first( columns ).get( 'id' ), 0 );
        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var parentId = view.model.get( 'parent' );
        var index = view.model.get( 'order' );
        var tag = 'tailor_content';

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, index );
            view.model.collection.createWrapper( this.get( 'tag' ), column.get( 'id' ), 0 );
        }
        else {

            var columns = view.model.collection.createRow( parentId, index );
            view.model.collection.insertChild( view.model, _.first( columns ) );
            view.model.collection.createWrapper( this.get( 'tag' ), _.last( columns ).get( 'id' ), 0 );

        }
    },

    /**
     * Inserts the element inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    createChild : function( view ) {
        var parentId = view.model.get( 'id' );
        var childTag = view.model.get( 'child' );
        var numberChildren = view.model.collection.where( { parent : parentId, tag : childTag } ).length;
        var wrapper = view.model.collection.createWrapper( childTag, parentId, numberChildren, false );

        view.model.collection.createWrapper( this.get( 'tag' ), wrapper.get( 'id' ), 0 );
    }

} );

module.exports = WrapperModel;
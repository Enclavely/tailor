var ElementModel = Backbone.Model.extend( {

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
     * Creates and inserts an element before the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) - 1 );
    },

    /**
     * Creates and inserts an element after the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates a new element at the given position.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     */
    insertAtIndex : function( model, index ) {
        model.collection.create( [ {
            tag : this.get( 'tag' ),
            label : this.get( 'label' ),
            parent : model.get( 'parent' ),
            type : this.get( 'type' ),
            order : index
        } ], {} );
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

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) - 1 );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : column.get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : _.first( columns ).get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );

            view.model.collection.insertChild( view.model, _.last( columns ) );

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

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : column.get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : _.last( columns ).get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );

            view.model.collection.insertChild( view.model, _.first( columns ) );
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

        var child = view.model.collection.create( [ {
            tag : this.get( 'tag' ),
            label : this.get( 'label' ),
            parent : wrapper.get( 'id' ),
            type : this.get( 'type' ),
            order : 0
        } ], {
            at : 0
        } );
    }

} );

module.exports = ElementModel;
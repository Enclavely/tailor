var ContainerModel = Backbone.Model.extend( {

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
    },

    /**
     * Creates and inserts an element before the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates and inserts an element after the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) + 1 );
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
        var tag = 'tailor_content';
        var children = model.collection.create( [ {
            tag : tag,
            atts : {}
        }, {
            tag : tag,
            atts : {}
        } ], {
            silent : true
        } );

        model.collection.createContainer( this, model.get( 'parent' ), index, children );
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
        var tag = 'tailor_content';
        var children;

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) - 1 );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, column.get( 'id' ), 0, children );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.insertChild( view.model, _.last( columns ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, _.first( columns ).get( 'id' ), 0, children );
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
        var tag = 'tailor_content';
        var children;

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, column.get( 'id' ), 0, children );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.insertChild( view.model, _.first( columns ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, _.last( columns ).get( 'id' ), 0, children );
        }
    }

} );

module.exports = ContainerModel;
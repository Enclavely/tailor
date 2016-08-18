var TemplateModel = Backbone.Model.extend( {

    /**
     * Returns an object containing the default parameters for a template.
     *
     * @since 1.0.0
     * @returns object
     */
    defaults : function() {
        return {
            id : this.cid,
            label : '',
            collection : 'template'
        };
    },

    /**
     * Initializes the element model.
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

    createChild : function( view ) {
        var parentId = view.model.get( 'id' );
        var childTag = view.model.get( 'child' );
        var numberChildren = view.model.collection.where( { parent : parentId, tag : childTag } ).length;
        var wrapper = view.model.collection.createWrapper( childTag, parentId, numberChildren, false );

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, wrapper.get( 'id' ), 0 );
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

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, column.get( 'id' ), 0 );

        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, _.first( columns ).get( 'id' ), 0 );
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

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, column.get( 'id' ), 0 );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, _.last( columns ).get( 'id' ), 0 );

            view.model.collection.insertChild( view.model, _.first( columns ) );
        }
    },

    /**
     * Creates and inserts a template before the target view inside a section.
     *
     * @since 1.0.0
     * @param view
     */
	insertBefore : function( view ) {

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, view.model.get( 'parent' ), view.model.get( 'order' ) - 1 );
	},

	insertAfter : function( view ) {

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, view.model.get( 'parent' ), view.model.get( 'order' ) );
    }

} );

module.exports = TemplateModel;

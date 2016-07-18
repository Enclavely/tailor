Tailor.Collections = Tailor.Collections || {};

Tailor.Collections.Element = require( './collections/elements' );
Tailor.Collections.History = require( './collections/history' );

module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @param options
     */
	onBeforeStart : function( options ) {
        var module = this;
        var api = {

            /**
             * Returns a given element if an ID is provided, otherwise the element collection.
             *
             * @since 1.0.0
             *
             * @param id
             * @returns {*}
             */
            getElements : function( id ) {
                return ( id ) ? module.elementCollection.findWhere( { id : id } ) : module.elementCollection;
            },

            /**
             * Returns a given history entry if an ID is provided, otherwise the history entry collection.
             *
             * @since 1.0.0
             *
             * @param id
             * @returns {*}
             */
            getHistory : function( id ) {
                return ( id ) ? module.historyCollection.findWhere( { id : id } ) : module.historyCollection;
            },

            /**
             * Resets the element collection with an array of objects.
             *
             * New templates are created in a single request to the server before the collection is reset.
             *
             * @since 1.0.0
             *
             * @param models
             */
            resetElements : function( models ) {
                if ( models === module.elementCollection.models ) {
                    return;
                }

                var canvas = document.getElementById( 'canvas' );
                var templates;

                canvas.classList.add( 'is-loading' );

                var options = {

                    /**
                     * Data passed to the reset function.
                     *
                     * @since 1.0.0
                     */
                    data : {
                        models : JSON.stringify( models ),
                        nonce : window._nonces.reset
                    },

                    /**
                     * Appends the element templates to the page.
                     *
                     * @since 1.0.0
                     *
                     * @param response
                     */
                    success : function( response ) {

                        // Update the model collection with the sanitized models
                        models = response.models;

                        // Record the template HTML and append it to the page
                        templates = response.templates;

	                    /**
	                     * Fires when existing custom CSS rules are clear.
	                     *
	                     * @since 1.0.0
	                     */
                        app.channel.trigger( 'css:clear' );

	                    /**
	                     * Fires when custom CSS rules are added.
	                     *
	                     * @since 1.0.0
	                     */
	                    app.channel.trigger( 'css:add', response.css );
                    },

                    /**
                     * Resets the collection with the given set of elements.
                     *
                     * @since 1.0.0
                     */
                    complete : function( response ) {
                        if ( templates ) {

	                        jQuery( 'body' ).append( templates );

                            /**
                             * Fires before the element collection is restored.
                             *
                             * @since 1.0.0
                             */
                            app.channel.trigger( 'before:elements:restore' );
                            app.channel.trigger( 'canvas:reset' );

                            module.elementCollection.reset( null );
                            module.elementCollection.reset( models );

                            /**
                             * Fires when the element collection is restored.
                             *
                             * @since 1.0.0
                             */
                            app.channel.trigger( 'elements:restore' );
                        }
                        canvas.classList.remove( 'is-loading' );
                    }
                };

                window.ajax.send( 'tailor_reset', options );
            },

            /**
             * Loads a template by retrieving, sanitizing and inserting the associated models into the element
             * collection.
             *
             * @since 1.0.0
             *
             * @param model
             * @param parent
             * @param index
             */
            loadTemplate : function( model, parent, index ) {
                var canvas = document.getElementById( 'canvas' );
                var models;
                var templates;

                canvas.classList.add( 'is-loading' );

                var options = {

                    /**
                     * Data passed to the reset function.
                     */
                    data : {
                        template_id : model.get( 'id' ),
                        nonce : window._nonces.loadTemplate
                    },

                    /**
                     * Appends the element templates to the page.
                     *
                     * @param response
                     */
                    success : function( response ) {
                        models = response.models;
                        templates = response.templates;

                        jQuery( 'body' ).append( templates );

	                    /**
	                     * Fires when custom CSS rules are added.
	                     *
	                     * @since 1.0.0
	                     */
                        app.channel.trigger( 'css:add', response.css );
                    },

                    /**
                     * Resets the collection with the given set of elements.
                     */
                    complete : function( response ) {
                        if ( templates ) {
                            var parents = [];
                            var children = [];

                            _.each( models, function( model ) {
                                if ( '' == model.parent ) {
                                    parents.push( model );
                                }
                                else {
                                    children.push( model );
                                }
                            } );

                            module.elementCollection.add( children, { silent : true } );

                            if ( parents.length > 1 ) {
                                module.elementCollection.add( parents, { at : index + 1 } );
                            }
                            else {
                                parents[0].parent = parent;
                                parents[0].order = index;
                                module.elementCollection.add( parents );
                            }
                        }

                        /**
                         * Fires when a template is added.
                         *
                         * @since 1.0.0
                         */
                        app.channel.trigger( 'template:add', model );

                        canvas.classList.remove( 'is-loading' );
                    }
                };

                window.ajax.send( 'tailor_load_template', options );
            }
        };

        app.channel.reply( 'canvas:elements', api.getElements );
        app.channel.reply( 'sidebar:history', api.getHistory );

        app.channel.on( 'elements:reset', api.resetElements );
        app.channel.on( 'template:load', api.loadTemplate );

	    this.elementCollection = new Tailor.Collections.Element( options.elements, { silent: false } );
	    this.historyCollection = new Tailor.Collections.History();
	    this.l10n = options.l10n;
    },

    /**
     * Initializes the Elements module.
     *
     * @param options
     */
    onStart : function( options ) {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.elementCollection, 'change:atts', this.onEditAttributes );

        this.listenTo( app.channel, 'element:add', this.onAddElement );
	    this.listenTo( app.channel, 'element:copy', this.onCopyElement );
	    this.listenTo( app.channel, 'element:move', this.onMoveElement );

        this.listenTo( app.channel, 'modal:apply', this.onEditElement );
        this.listenTo( app.channel, 'element:delete', this.onDeleteElement );
        this.listenTo( app.channel, 'element:resize', this.onResizeElement );
        this.listenTo( app.channel, 'element:change:order', this.onReorderElement );

        this.listenTo( app.channel, 'template:add', this.onAddTemplate );

        this.listenTo( app.channel, 'history:restore', this.restoreSnapshot );
        this.listenTo( app.channel, 'history:undo', this.undoStep );
        this.listenTo( app.channel, 'history:redo', this.redoStep );

    },

    /**
     * Triggers an event when an element's attributes are changed.
     *
     * @since 1.0.0
     *
     * @param model
     * @param atts
     */
    onEditAttributes : function( model, atts ) {
        if ( model.previous( 'atts' ) === model.get( 'atts' ) ) {
            return;  // Do not trigger an event on the channel if this is a preview
        }

        /**
         * Fires after the element has been edited.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'element:edit', model );
    },

    /**
     * Creates a new history entry after a new element is added.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onAddElement : function( model ) {

        // Only show elements in the list of snapshots
        // Templates are added separately
        if ( 'library' != model.get( 'collection' ) ) {
            return;
        }

        this.saveSnapshot( this.l10n.added + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is edited.
     *
     * @since 1.0.0
     *
     * @param modal
     * @param model
     */
    onEditElement : function( modal, model ) {
        this.saveSnapshot( this.l10n.edited + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is copied.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onCopyElement : function( model ) {
        this.saveSnapshot( this.l10n.copied + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is moved.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onMoveElement : function( model ) {
        this.saveSnapshot( this.l10n.moved + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is deleted.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onDeleteElement : function( model ) {
        this.saveSnapshot( this.l10n.deleted + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is resized.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onResizeElement : function( model ) {
        this.saveSnapshot( this.l10n.resized + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after the children of a container are reordered.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onReorderElement : function( model ) {
        this.saveSnapshot( this.l10n.reordered + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after a template is added.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onAddTemplate : function( model ) {
        this.saveSnapshot( this.l10n.added + ' ' + this.l10n.template + ' - ' + model.get( 'label' ) );
    },

    /**
     * Creates a snapshot of the element collection.
     *
     * @since 1.0.0
     *
     * @param label
     */
    saveSnapshot : function( label ) {
        this.historyCollection.save( label );
    },

    /**
     * Restores a snapshot of the element collection.
     *
     * @since 1.0.0
     *
     * @param timestamp
     */
    restoreSnapshot : function( timestamp ) {
        this.historyCollection.restore( timestamp );
    },

    /**
     * Restores the previous history snapshot.
     *
     * @since 1.0.0
     */
    undoStep : function() {
        this.historyCollection.undo();
    },

    /**
     * Restores the next history snapshot.
     *
     * @since 1.0.0
     */
    redoStep : function() {
        this.historyCollection.redo();
    }

} );
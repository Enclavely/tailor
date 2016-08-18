var $ = Backbone.$,
    $body = $( 'body' ),
    $win = $( window ),
    ElementCollection = require( '../../entities/collections/elements' ),
    ElementModule;

ElementModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @param options
     */
	onBeforeStart : function( options ) {
        var module = this;

        this.collection = new ElementCollection( options.elements, { silent: false } );

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
                if ( id ) {
                    return module.collection.findWhere( { id : id } );
                }
                return module.collection;
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
                if ( models === module.collection.models ) {
                    return;
                }

                var canvas = app.canvasRegion.el;
                var templates;
                
                canvas.classList.add( 'is-loading' );
                
                window.ajax.send( 'tailor_reset', {
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

                        $body.append( templates );
                        
                        /**
                         * Clears all existing dynamic CSS rules.
                         *
                         * @since 1.0.0
                         */
                        app.channel.trigger( 'css:clear' );

                        /**
                         * Adds new dynamic CSS rules.
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
                    complete : function() {

                        if ( templates ) {

                            /**
                             * Fires before the element collection is restored.
                             *
                             * @since 1.0.0
                             */
                            app.channel.trigger( 'before:elements:restore' );
                            app.channel.trigger( 'canvas:reset' );

                            module.collection.reset( null );
                            module.collection.reset( models );

                            /**
                             * Fires when the element collection is restored.
                             *
                             * @since 1.0.0
                             */
                            app.channel.trigger( 'elements:restore' );

                            $win.trigger( 'resize' );
                        }

                        canvas.classList.remove( 'is-loading' );
                    }
                } );
            }
        };

        app.channel.reply( 'canvas:elements', api.getElements );
        app.channel.on( 'elements:reset', api.resetElements );
    },

    /**
     * Initializes the module.
     */
    onStart : function() {

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:elements:ready', this );
    }

} );

module.exports = ElementModule;
var $ = Backbone.$,
    $body = $( 'body' ),
    $win = $( window ),
    TemplateModule;

TemplateModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     */
	onStart : function() {
        var module = this;
        this.collection = app.channel.request( 'canvas:elements' );
        var api = {

            /**
             * Loads a template by retrieving, sanitizing and inserting the associated models into the collection.
             *
             * @since 1.0.0
             *
             * @param model
             * @param parent
             * @param index
             */
            loadTemplate : function( model, parent, index ) {
                var models;
                var templates;
                var canvas = app.canvasRegion.el;
                
                canvas.classList.add( 'is-loading' );
                
                window.ajax.send( 'tailor_load_template', {
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

                        // Update the model collection with the sanitized models
                        models = response.models;

                        // Record the template HTML and append it to the page
                        templates = response.templates;
                        $body.append( templates );
                        
                        /**
                         * Adds new dynamic CSS rules.
                         *
                         * @since 1.0.0
                         */
                        app.channel.trigger( 'css:add', response.css );
                    },

                    /**
                     * Resets the collection with the given set of elements.
                     */
                    complete : function() {
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

                            module.collection.add( children, { silent : true } );

                            if ( parents.length > 1 ) {
                                module.collection.add( parents, { at : index + 1 } );
                            }
                            else {
                                parents[0].parent = parent;
                                parents[0].order = index;
                                module.collection.add( parents );
                            }

                            /**
                             * Fires when a template is added.
                             *
                             * @since 1.0.0
                             */
                            app.channel.trigger( 'template:add', model );
                        }

                        canvas.classList.remove( 'is-loading' );
                    }
                } );
            }
        };

        app.channel.on( 'template:load', api.loadTemplate );

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:templates:ready', this );
    }

} );

module.exports = TemplateModule;
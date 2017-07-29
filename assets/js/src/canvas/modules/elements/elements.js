var $ = Backbone.$,
    $body = $( 'body' ),
    $win = $( window ),
    ElementCollection = require( '../../entities/collections/elements' ),
    ElementModule;

var $templates = jQuery( '<div id="tailor-templates"></div>' ).appendTo( $body );

ElementModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @param options
     */
	onBeforeStart : function( options ) {
        var module = this;

        this.collection = new ElementCollection( options.elements );
        
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
             * @param templates
             * @param css
             */
            resetElements : function( models, templates, css ) {
                if ( models === module.collection.models ) {
                    return;
                }

                $templates.append( templates );

                /**
                 * Clears all existing dynamic CSS rules.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'css:clear' );

                /**
                 * Fires before the element collection is restored.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'before:elements:restore' );
                app.channel.trigger( 'canvas:reset' );

                module.collection.reset( [] );
                module.collection.reset( models );

                /**
                 * Adds new dynamic CSS rules.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'css:add', css );

                /**
                 * Fires when the element collection is restored.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'elements:restore' );

                $win.trigger( 'resize' );
            },

            getTemplates: function() {
                module.collection.each( function( model ) {
                    model.trigger( 'template', model.get( 'id' ) );
                } );
                return $templates[0].innerHTML;
            }
        };

        app.channel.reply( 'canvas:elements', api.getElements );
        app.channel.reply( 'canvas:templates', api.getTemplates );
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
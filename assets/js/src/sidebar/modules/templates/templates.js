
var TemplateCollection = require( '../../entities/collections/templates' ),
	TemplatesPanel = require( './show/templates-panel' ),
	TemplateItem = require( './show/template-menu-item' ),
	TemplatesModule;

Tailor.Panels.Templates = TemplatesPanel;
Tailor.Items.Templates = TemplateItem;

TemplatesModule = Marionette.Module.extend( {

	onBeforeStart : function( options ) {
        var module = this;
		
        this.collection = new TemplateCollection( options.templates );
		
		var api = {

            /**
             * Returns the template item collection.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            getTemplates : function() {
                return module.collection;
            }
		};

        app.channel.reply( 'sidebar:templates', api.getTemplates );
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
		app.channel.trigger( 'module:templates:ready', this );
	}
	
} );

module.exports = TemplatesModule;
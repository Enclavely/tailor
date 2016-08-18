var l10n = window._l10n,
    TemplatesPanel;

TemplatesPanel = Marionette.CompositeView.extend( {

    ui : {
        backButton : '.back-button',
        save : '.js-save-template',
        import : '.js-import-template',
        searchForm : '.search-form'
    },

    events : {
        'click @ui.save' : 'save',
        'click @ui.import' : 'import'
    },

    triggers : {
        'click @ui.backButton': 'back:home'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : Tailor.Panels.Empty,

    emptyViewOptions : function() {
        return {
            type : this.model.get( 'type' )
        };
    },

    template : '#tmpl-tailor-panel-templates',

    childViewContainer : '#items',

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {*|exports|module.exports}
     */
    getChildView : function() {
        return Tailor.lookup( this.model.get( 'type' ), false, 'Items' );
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.items = this.collection;
        return data;
    },

	/**
	 * Sets focus on the back button when the panel is displayed.
	 *
	 * @since 1.0.0
	 */
    onShow : function() {
        this.ui.backButton.get(0).focus();
        if ( 0 === this.collection.length ) {
            this.ui.searchForm.hide();
        }
    },

	/**
	 * Shows the search form after a child is added.
	 *
	 * @since 1.0.0
	 */
    onAddChild : function() {
		this.ui.searchForm.show();
    },

	/**
	 * Hides the search form if there are no saved templates after a template is removed.
	 *
	 * @since 1.0.0
	 */
    onRemoveChild : function() {
        if ( 0 === this.collection.length ) {
            this.ui.searchForm.hide();
        }
    },

	/**
	 * Opens the Import Template dialog.
	 *
	 * @since 1.0.0
	 */
    import : function( e ) {
        var panel = this;
        var options = {
            title : l10n.importTemplate,
            content : document.querySelector( '#tmpl-tailor-dialog-import-template').innerHTML,
            button : l10n.import,

	        /**
	         * Sets focus on the template selection field.
             */
            onOpen : function() {
                this.el.querySelector( '#import-template' ).focus();
            },

	        /**
             * Returns true if the selected file is a JSON file.
             *
             * @returns {*|boolean}
             */
            onValidate : function() {
                var input = this.el.querySelector( '#import-template' );
                var re = /(?:\.([^.]+))?$/;
                return input.value && ( 'json' === re.exec( input.value )[1] );
            },

	        /**
             * Saves the selected JSON file as a template.
             */
            onSave : function() {
                var input = this.el.querySelector( '#import-template' );
                var file = input.files[0];
                if ( ! file || file.name.match( /.+\.json/ ) ) {
                    var reader = new FileReader();
                    reader.onload = function( e ) {
                        var defaults = {
                            label : '',
                            tag : '',
                            models : [],
                            nonce : window._nonces.saveTemplate
                        };
                        var data = _.extend( defaults, JSON.parse( reader.result ) );
                        data.models = JSON.stringify( data.models );
                        panel.createTemplate( data, 'import' );
                    };
                    try {
                        reader.readAsText( file );
                    }
                    catch( e ) {}
                }
            },

	        /**
	         * Sets focus back to the Import Template button.
             */
            onClose : function() {
                panel.ui.import.focus();
            }
        };

		/**
         * Fires when the dialog window is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'dialog:open', options );
    },

	/**
	 * Opens the Save Template dialog.
	 *
	 * @since 1.0.0
	 */
    save : function() {
        var selected = app.channel.request( 'canvas:element:selected' );
        var elements = app.channel.request( 'canvas:elements' );
        var models = [];
        var tag;

        if ( selected && 'function' == typeof selected.get ) {
            var getChildren = function( id ) {
                _.each( elements.where( { parent : id } ), function( model ) {
                    models.push( model.toJSON() );
                    getChildren( model.get( 'id' ) );
                } );
            };

            if ( 'child' == selected.get( 'type' ) ) {
                selected = selected.collection.get( selected.get( 'parent' ) );
            }

            getChildren( selected.get( 'id' ) );

            selected = selected.toJSON();
            selected.parent = '';
            models.push( selected ) ;
            tag = selected.tag;
        }
        else {
            models = elements.models;
            tag = 'tailor_section';
        }

        var panel = this;

        /**
         * Fires when the dialog window is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'dialog:open', {
            title : l10n.saveTemplate,
            content : document.querySelector( '#tmpl-tailor-dialog-save-template').innerHTML,
            button : l10n.save,

	        /**
             * Sets focus on the template name field.
             */
            onOpen : function() {
                this.el.querySelector( '#save-template' ).focus();
            },

	        /**
             * Returns true if the template name is not empty.
             *
             * @returns {*}
             */
            onValidate : function() {
                var input = this.el.querySelector( '#save-template' );
                return input.value.trim();
            },

	        /**
             * Saves the current selection as a new template.
             */
            onSave : function() {
                var input = this.el.querySelector( '#save-template' );
                var data = {
                    label : input.value,
                    tag : tag,
                    models : JSON.stringify( models ),
                    nonce : window._nonces.saveTemplate
                };
                panel.createTemplate( data, 'save' );
            },

	        /**
             * Sets focus back to the Save Template button.
             */
            onClose : function() {
                panel.ui.save.focus();
            }
        } );
    },

    /**
     * Sends a request to the server to register a new template.
     *
     * Occurs after a template is saved or imported.
     *
     * @since 1.0.0
     *
     * @param data
     * @param action
     */
    createTemplate : function( data, action ) {

        action = action || 'save';

        var panel = this;
        var collection = panel.collection;

        panel.ui.save.prop( 'disabled', true );
        panel.ui.import.prop( 'disabled', true );

        window.ajax.send( 'tailor_save_template', {
            data : data,

	        /**
             * Adds the new template to the collection.
             *
             * @param response
             */
            success : function( response ) {
                collection.add( {
                    id : response.id,
                    label : response.label,
                    tag : response.tag,
                    type : response.type
                } );

                /**
                 * Fires when a template is saved or imported.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'template:' + action );
            },

	        /**
             * Update the UI upon completion.
             */
            complete : function() {
                panel.ui.save.prop( 'disabled', false );
                panel.ui.import.prop( 'disabled', false );
            }
        } );
    }

} );

module.exports = TemplatesPanel;
/**
 * Tailor.Panels.Templates
 *
 * The templates panel.
 *
 * @augments Marionette.CompositeView
 */
var $ = Backbone.$,
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

    emptyView : require( './panel-empty' ),

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
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return window.Tailor.Items.lookup( this.model.get( 'type' ) );
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
        //if ( 1 === this.collection.length ) {
		this.ui.searchForm.show();
        //}
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

        var that = this;
        var options = {
            title : window._l10n.importTemplate,
            content : document.querySelector( '#tmpl-tailor-dialog-import-template').innerHTML,
            button : window._l10n.import,

            onOpen : function() {
                this.el.querySelector( '#import-template' ).focus();
            },

            onValidate : function() {

                var input = this.el.querySelector( '#import-template' );
                var re = /(?:\.([^.]+))?$/;

                return input.value && ( 'json' === re.exec( input.value )[1] );
            },

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

                        that.createTemplate( data, 'import' );
                    };

                    try {
                        reader.readAsText( file );
                    }
                    catch( e ) {}
                }
            },

            onClose : function() {
                that.ui.import.focus();
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
    save : function(  ) {
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

        var that = this;

        var options = {
            title : window._l10n.saveTemplate,
            content : document.querySelector( '#tmpl-tailor-dialog-save-template').innerHTML,
            button : window._l10n.save,

            onOpen : function() {
                this.el.querySelector( '#save-template' ).focus();
            },

            onValidate : function() {
                var input = this.el.querySelector( '#save-template' );
                return input.value;
            },

            onSave : function() {
                var input = this.el.querySelector( '#save-template' );

                var data = {
                    label : input.value,
                    tag : tag,
                    models : JSON.stringify( models ),
                    nonce : window._nonces.saveTemplate
                };

                that.createTemplate( data, 'save' );
            },

            onClose : function() {
                that.ui.save.focus();
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
     * Sends a request to the server to register a new template.
     *
     * @since 1.0.0
     *
     * @param data
     * @param action
     */
    createTemplate : function( data, action ) {

        action = action || 'save';

        var that = this;
        var collection = that.collection;

        that.ui.save.prop( 'disabled', true );
        that.ui.import.prop( 'disabled', true );

        var options = {
            data : data,

            success : function( response ) {
                collection.add( {
                    id : response.id,
                    label : response.label,
                    tag : response.tag,
                    type : response.type
                } );

                /**
                 * Fires when a template is created.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'template:' + action );
            },

            complete : function() {
                that.ui.save.prop( 'disabled', false );
                that.ui.import.prop( 'disabled', false );
            }
        };

        window.ajax.send( 'tailor_save_template', options );
    }

} );

module.exports = TemplatesPanel;
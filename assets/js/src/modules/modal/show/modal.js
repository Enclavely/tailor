/**
 * Modal view for editing element settings.
 *
 * @class
 */
var $ = window.jQuery,
	ModalView;

ModalView = Marionette.LayoutView.extend( {

	className : 'modal',

	ui : {
		close : '.js-close',
        preview : '.js-preview',
		apply : '.js-apply'
	},

    behaviors : {
        Resizable : {
            ui : {
                handle : '.modal__title'
            }
        }
    },

    triggers : {
        'click @ui.close' : 'close',
        'click @ui.preview' : 'preview',
        'click @ui.apply' : 'apply'
    },

    modelEvents : {
        'destroy' : 'destroy'
    },

	template : '#tmpl-tailor-modal',

	regions: {
        tabs : '#tailor-modal-tabs',
		sections : '#tailor-modal-sections'
	},

    /**
     * Initializes the modal window.
     *
     * @since 1.0.0
     *
     * @param options
     */
	initialize : function( options ) {
        this.isModified = false;
        this.settings = app.channel.request( 'sidebar:settings', this.model );
        this.addEventListeners();

        /**
         * Fires when the modal window is initialized.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:initialize', this, this.model );
	},

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.settings, 'change', this.onChange );
    },

    /**
     * Renders the modal tabs and sections.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var sections = app.channel.request( 'sidebar:sections', this.model );
        var controls = app.channel.request( 'sidebar:controls', this.model );
        var SectionsView = require( './sections' );
        this.showChildView( 'sections', new SectionsView( {
            element : this.model,
            collection : sections,
            controls : controls
        } ) );

        if ( sections.length > 1 ) {
            var TabsView = require( './tabs' );
            this.showChildView( 'tabs', new TabsView( {
                collection : sections
            } ) );

            this.el.classList.add( 'has-sections' );
        }

        this.model.collection.trigger( 'edit', this.model, true );
    },

    /**
     * Sets the initial focus and checks the position of the modal window when it is first shown.
     *
     * @since 1.0.0
     */
    onShow : function() {
        this.ui.close.focus();
    },

    /**
     * Updates the modal window controls when an element setting is changed.
     *
     * @since 1.0.0
     */
    onChange : function() {
        this.isModified = true;
        this.ui.preview.attr( 'disabled', false );
        this.ui.apply.attr( 'disabled', false );
    },

    /**
     * Previews current changes without applying them.
     *
     * @since 1.0.0
     */
    onPreview : function() {
        if ( ! this.model.isTracking() ) {
            this.model.startTracking();
        }

	    this.model.set( 'atts', this._getAttributes() );
        this.ui.preview.attr( 'disabled', true );

        /**
         * Fires when element settings are previewed.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:preview', this, this.model );
    },

    /**
     * Closes the modal window and applies changes.
     *
     * @since 1.0.0
     */
    onApply : function() {
        this.model.stopTracking();
	    this.model.set( 'atts', this._getAttributes() );

        /**
         * Fires when element settings are applied.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:apply', this, this.model );

        this.triggerMethod( 'destroy' );
    },

    /**
     * Closes the modal window.
     *
     * The user is prompted to apply changes, if changes have been made (and not already previewed).
     *
     * @since 1.0.0
     */
    onClose : function() {
        if ( this.isModified ) {
            var applyChanges = confirm( 'You have made changes to this element.  Would you like to apply them?' );

            if ( true === applyChanges ) {
                this.triggerMethod( 'apply' );
            }
            else {
                this.model.resetAttributes();
            }
        }

        /**
         * Fires when the modal window is closed.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:close', this );

        this.triggerMethod( 'destroy' );
    },

    /**
     * Triggers an event when the modal window is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.model.collection.trigger( 'edit', this.model, false );

        /**
         * Fires when the modal window is destroyed.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:destroy', this, this.model );
    },

    /**
     * Returns the current setting values.
     *
     * @since 1.0.0
     *
     * @returns {{}}
     * @private
     */
    _getAttributes : function() {
        var atts = {};

        this.settings.each( function( setting ) {
            atts[ setting.get( 'id' ) ] = setting.get( 'value' );
        }, this );

        return atts;
    }

} );

module.exports = ModalView;
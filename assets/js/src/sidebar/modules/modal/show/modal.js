var SectionCollectionView = require( './sections' ),
    NavigationView = require( './tabs' ),
    ModalView;

ModalView = Marionette.LayoutView.extend( {

	className : 'modal',

	ui : {
		close : '.js-close',
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
     */
	initialize : function() {
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
        var model = this.model;
        var sections = app.channel.request( 'sidebar:sections', model );
        var controls = app.channel.request( 'sidebar:controls', model );
        
        this.showChildView( 'sections', new SectionCollectionView( {
            element : model,
            collection : sections,
            controls : controls
        } ) );

        if ( sections.length > 1 ) {
            this.showChildView( 'tabs', new NavigationView( {
                collection : sections
            } ) );
            this.el.classList.add( 'has-sections' );
        }

        model.collection.trigger( 'edit', model, true );
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
    onChange : function( setting ) {
        this.isModified = true;
        this.ui.apply.attr( 'disabled', false );
        
        var model = this.model;
        if ( ! model.isTracking() ) {
            model.startTracking();
        }

        var update = setting.get( 'refresh' );
        var jsRefresh = update.hasOwnProperty( 'method' ) && 'js' == update['method'];
        
        // Check dependencies, if they exist
        if ( jsRefresh && update.hasOwnProperty( 'dependencies' ) ) {
            for ( var settingId in update['dependencies'] ) {
                if (
                    update['dependencies'].hasOwnProperty( settingId ) &&
                    _.has( update['dependencies'][ settingId ], 'condition' ) &&
                    _.has( update['dependencies'][ settingId ], 'value' )
                ) {
                    var targetSetting = setting.collection.get( settingId );
                    if ( targetSetting && ! Tailor.Helpers.checkCondition(
                            update['dependencies'][ settingId ]['condition'],
                            targetSetting.get( 'value' ),
                            update['dependencies'][ settingId ]['value']
                        )
                    ) {
                        jsRefresh = false;
                        break;
                    }
                }
            }
        }

        model.set( 'atts', this.atts(), { silent : jsRefresh } );
        
        if ( jsRefresh ) {

	        /**
	         * Triggers an event on the element model to inform it of a change to the setting.
             *
             * @since 1.5.0
             */
            model.trigger( 'change:setting', setting, model );
        }

        /**
         * Resets the canvas when previewing an element.
         *
         * @since 1.4.1
         */
        app.channel.trigger( 'canvas:reset' );
    },

    /**
     * Closes the modal window and applies changes.
     *
     * @since 1.0.0
     */
    onApply : function() {
        this.model.stopTracking();
	    this.model.set( 'atts', this.atts() );

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
            var applyChanges = confirm( window._l10n.confirmElement );

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
     */
    atts : function() {
        var atts = {};
        this.settings.each( function( setting ) {
            var value = setting.get( 'value' );
            if ( null !== value ) {
                atts[ setting.get( 'id' ) ] = value;
            }
        }, this );
        return atts;
    }

} );

module.exports = ModalView;
var $ = window.jQuery,
    DevicePreviewModule;

DevicePreviewModule = Marionette.Module.extend( {

    device : 'desktop',

    onBeforeStart : function() {
        var module = this;
        var api = {

            /**
             * Returns the current device preview size.
             *
             * @since 1.7.4
             *
             * @returns {*}
             */
            getDevice : function() {
                return module.device;
            }
        };

        app.channel.reply( 'sidebar:device', api.getDevice );
    },

    /**
     * Initializes the module.
     *
     * @since 1.7.4
     */
	onStart : function() {
        var module = this;
        this.$buttons = $( '.tailor-sidebar .devices button' );
        this.preview = document.querySelector( '.tailor-preview' );
        this.viewport = this.preview.querySelector( '.tailor-preview__viewport' );
        this.mediaQueries = window._media_queries;

        //this.setActive( this.$buttons.get(0) );
        this.setDevice( this.$buttons.get(0).getAttribute( 'data-device' ) );

        this.addEventListeners();

        /**
         * Fires when the module is initialized.
         *
         * @since ≈
         *
         * @param this
         */
        app.channel.trigger( 'module:devicePreview:ready', this );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.7.4
     */
    addEventListeners : function() {
        this.$buttons.on( 'click', this.onClick.bind( this ) );
        app.channel.on( 'sidebar:device', this.setDevice.bind(this) );
    },

    onClick: function( e ) {
        this.setDevice( e.target.getAttribute( 'data-device' ) );
    },

    setDevice: function( device ) {
        this.device = device;

        // Update buttons
        var $button = this.$buttons.filter( "[data-device='" + this.device + "']" );
        this.$buttons.removeClass( 'is-active' ).attr( 'aria-pressed', false );
        $button.addClass( 'is-active' ).attr( 'aria-pressed', true );

        // Update preview window
        if ( this.mediaQueries.hasOwnProperty( this.device ) && this.mediaQueries[ this.device ].max ) {
            this.viewport.style.maxWidth = this.mediaQueries[ this.device ].max;
        }
        else {
            this.viewport.style.maxWidth ='';
        }
    }
} );

module.exports = DevicePreviewModule;

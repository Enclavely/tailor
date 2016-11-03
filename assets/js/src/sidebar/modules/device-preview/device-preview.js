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

        this.setActive( this.$buttons.get(0) );
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
        this.$buttons.on( 'click', this.onDevicePreview.bind( this ) );
    },

    onDevicePreview : function( e ) {
        var button = e.target;
        var previous = this.$buttons.filter( "[data-device='" + this.device + "']" ).get(0);

        this.setInactive( previous );
        this.setActive( button );

        this.device = button.getAttribute( 'data-device' );
        this.preview.className = 'tailor-preview ' + this.device + '-screens';
        if ( this.mediaQueries.hasOwnProperty( this.device ) && this.mediaQueries[ this.device ].max ) {
            this.viewport.style.maxWidth = this.mediaQueries[ this.device ].max;
        }
        else {
            this.viewport.style.maxWidth ='';
        }
    },

    setActive: function( button ) {
        button.classList.add( 'is-active' );
        button.setAttribute( 'aria-pressed', 'true' );
    },

    setInactive: function( button ) {
        button.classList.remove( 'is-active' );
        button.setAttribute( 'aria-pressed', 'false' );
    }
} );

module.exports = DevicePreviewModule;

/**
 * Tailor.Controls.Icon
 *
 * An icon control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    IconControl;

IconControl = AbstractControl.extend( {

	ui: {
        'select' : '.button--select',
        'change' : '.button--change',
        'remove' : '.button--remove',
        'icon' : 'i',
        'default' : '.js-default'
	},

    events : {
        'click @ui.select' : 'openDialog',
        'click @ui.change' : 'openDialog',
        'click @ui.remove' : 'removeIcon',
        'click @ui.icon' : 'openDialog',
        'click @ui.default' : 'restoreDefaultValue'
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.render );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
    },

	/**
	 * Opens the icon selection dialog.
	 *
	 * @since 1.0.0
	 */
    openDialog : function() {
        var control = this;
        var options = {
            title : 'Select Icon',
            button : window._l10n.select,

            /**
             * Returns the content for the Select Icon dialog.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            content : function() {
                var kits = window._kits || {};
                var value = control.getSettingValue();

                if ( _.keys( kits ).length ) {
                    return _.template( document.getElementById( 'tmpl-tailor-control-icon-select' ).innerHTML)( {
                        kits : kits,
                        value : value
                    } );
                }

                return document.getElementById( 'tmpl-tailor-control-icon-empty' ).innerHTML;
            },

	        /**
	         * Adds the required event listeners to the dialog window content.
	         *
	         * @since 1.0.0
	         */
            onOpen : function() {
                var $el = this.$el;
                var $li = $el.find( 'li' );
                var $kits = $el.find( '.icon-kit' );

                this.$el.find( '.search--icon' ).on( 'input', function( e ) {
                    var term =  this.value.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );

                    term = term.replace( / /g, ')(?=.*' );
                    var match = new RegExp( '^(?=.*' + term + ').+', 'i' );

                    $li.each( function() {
                        this.classList.toggle( 'is-hidden', ! match.test( this.getAttribute( 'title' ) ) );
                    } );
                } );

                this.$el.find( '.select--icon' ).on( 'change', function( e ) {
                    var kit = this.value;
                    $kits
                        .removeClass( 'is-hidden' )
                        .filter( function() {
                            return this.id != kit;
                        } )
                        .addClass( 'is-hidden' );
                } );
            },

	        /**
	         * Returns true if an icon has been selected.
	         *
	         * @since 1.0.0
	         *
	         * @returns {*}
	         */
            onValidate : function() {
                return $( 'input[name=icon]:checked' ).val();
            },

	        /**
	         * Updates the setting value with the selected icon name.
	         *
	         * @since 1.0.0
	         */
            onSave : function() {
                control.setSettingValue( $( 'input[name=icon]:checked' ).val() );
            },

	        /**
	         * Cleans up event listeners.
	         *
	         * @since 1.0.0
	         */
            onClose : function() {
                this.$el.find( '.search--icon' ).off( 'input' );
            }
        };

	    /**
	     * Fires when the dialog window is opened.
	     *
	     * @since 1.0.0
	     */
	    app.channel.trigger( 'dialog:open', options );
    },

    removeIcon : function() {
        this.setSettingValue( '' );
    }

} );

module.exports = IconControl;
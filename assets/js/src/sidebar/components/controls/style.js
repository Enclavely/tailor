/**
 * Tailor.Controls.Style
 *
 * A style control.
 *
 * @augments Marionette.ItemView
 */
var $ = window.jQuery,
    AbstractControl = require( './abstract-control' ),
    StyleControl;

StyleControl = AbstractControl.extend( {

    linked : true,

    ui : {
        'input' : 'input',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'linkButton' : '.js-link',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'input @ui.input' : 'updateLinkedFields',
        'blur @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange',
        'click @ui.linkButton' : 'onLinkButtonChange'
    },

    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        data.choices = this.model.get( 'choices' );
        data.values = {};

        _.each( this.getValues(), function( value, media ) {
            data.values[ media ] = {};
            var values = [];
            if ( _.isString( value ) ) {
                if ( -1 != value.indexOf( ',' ) ) {
                    values = value.split( ',' );
                }
                else {
                    values = value.split( '-' ); // Old format
                }
            }

            var i = 0;
            for ( var choice in data.choices ) {
                if ( data.choices.hasOwnProperty( choice ) ) {
                    data.values[ media ][ choice ] = values[ i ];
                    i ++;
                }
            }
        } );

        return data;
    },

    /**
     * Updates the media-query based control groups when the control is rendered.
     *
     * @since 1.7.2
     */
    onRender : function() {
        this.updateControlGroups();
        this.updateLinkButton();
    },

	/**
     * Updates the control state when the Linked button is pressed.
     *
     * @since 1.7.2
     */
    onLinkButtonChange: function() {
        this.linked = ! this.linked;
        this.updateLinkButton();
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var fields = this.ui.input.filter( '[name^="' + this.media + '"]' ).serializeArray();
        var values = _.map( fields, function( field ) {
            return field.value;
        } );
        this.setValue( values.join( ',' ) );
    },

	/**
	 * Updates the Linked button state.
     *
     * @since 1.7.2
     */
    updateLinkButton: function() {
        this.ui.linkButton.toggleClass( 'is-active', this.linked );
    },

	/**
     * Updates linked fields when a setting value changed.
     *
     * @since 1.7.2
     *
     * @param e
     */
    updateLinkedFields : function( e ) {
        if ( this.linked ) {
            this.ui.input
                .filter( '[name^="' + this.media + '"]' )
                .filter( function( i, el ) { return el != e.currentTarget; } )
                .val( e.currentTarget.value );
        }
    }

} );

module.exports = StyleControl;

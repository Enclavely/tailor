/**
 * Dialog view for present growl-style notifications to the user.
 *
 * @class
 */
var $ = window.jQuery,
    DialogView;

DialogView = Backbone.Marionette.ItemView.extend( {

    className : 'dialog',

    defaults : {
        title : '',
        content : '',
        button : ''
    },

    ui : {
        close : '.js-close',
        content : '.dialog__content',
        save : '.js-save'
    },

    events : {
        'input' : 'onChange',
        'change' : 'onChange'
    },

    triggers : {
        'click @ui.close' : 'close',
        'click @ui.save' : 'save'
    },

    template : '#tmpl-tailor-dialog',

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {

        return {
            title : this.title,
            content : this.content,
            button : this.button
        }
    },

    /**
     * Initializes the dialog window.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.title = options.title || this.defaults.title;
        this.content = options.content || this.defaults.content;
        this.button = options.button || this.defaults.button;
        this.callbacks = {
            validate : options.onValidate,
            open : options.onOpen,
            save : options.onSave,
            close : options.onClose
        };
    },

	/**
     * Generate content using the content callback function, if provided.
     *
     * @since 1.0.0
     */
    onBeforeRender : function() {
        if ( 'function' == typeof this.content ) {
            this.content = this.content.call( this );
        }
    },

    /**
     * Triggers the "onOpen" and "onValidate" callback functions when the dialog window is loaded.
     *
     * @since 1.0.0
     */
    onDomRefresh : function() {
        if ( 'function' === typeof this.callbacks.open ) {
            this.callbacks.open.call( this );
        }

        this.validate();
    },

    /**
     * Triggers the "onValidate" callback function when the dialog window is changed.
     *
     * @since 1.0.0
     */
    onChange : function() {
        this.validate();
    },

    /**
     * Validates the contents of the dialog window.
     *
     * If the validation criteria are met, the Save button is enabled.
     *
     * @since 1.0.0
     */
    validate : function() {
        if ( 'function' === typeof this.callbacks.validate ) {
            this.ui.save.prop( 'disabled', ! this.callbacks.validate.call( this ) );
        }
    },

    /**
     * Triggers the "onSave" callback function and closes the dialog window.
     *
     * @since 1.0.0
     */
    onSave : function() {
        if ( 'function' === typeof this.callbacks.save ) {
            this.callbacks.save.call( this );
        }

        this.onClose();
    },

    /**
     * Closes the dialog window.
     *
     * @since 1.0.0
     */
    onClose : function() {
        if ( 'function' === typeof this.callbacks.close ) {
            this.callbacks.close.call( this );
        }

        this.triggerMethod( 'destroy' );
    }

} );

module.exports = DialogView;

var AbstractControl = Marionette.ItemView.extend( {

    tagName : 'li',

    className : function() {
        return 'control control--' + this.model.get( 'type' );
    },

    events : {
        'input @ui.input' : 'onControlChange',
        'change @ui.input' : 'onControlChange',
        'click @ui.default' : 'restoreDefaultValue'
    },

    getTemplate : function() {
        return '#tmpl-tailor-control-' + this.model.get( 'type' );
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        var defaultValue = this.getDefaultValue();

        data.value = this.getSettingValue();
        data.showDefault = null != defaultValue && ( data.value != defaultValue );

        return data;
    },

    /**
     * Initializes the control.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.addEventListeners();
        this.checkDependencies( this.model.setting );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.toggleDefaultButton );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
    },

    /**
     * Checks whether the control should be visible, based on its dependencies.
     *
     * @since 1.0.0
     *
     * @param setting
     */
    checkDependencies : function( setting ) {
        var dependencies = this.model.get( 'dependencies' );
        var settings = setting.collection;
        var visible = true;

        for ( var id in dependencies ) {
            if ( dependencies.hasOwnProperty( id ) ) {
                var target = settings.get( id );
                if ( ! target ) {
                    continue;
                }

                var condition = dependencies[ id ].condition;
                var actual = target.get( 'value' );
                var required = dependencies[ id ].value;

                if ( ! Tailor.Helpers.checkCondition( condition, actual, required ) ) {
                    visible = false;
                    break;
                }
            }
        }

        this.$el.toggle( visible );
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        if ( 'function' == typeof this.ui.input.val ) {
            this.setSettingValue( this.ui.input.val() );
        }
    },

    /**
     * Toggles the default button based on the setting value.
     *
     * @since 1.0.0
     */
    toggleDefaultButton : function() {
        var defaultValue = this.getDefaultValue();

        this.ui.default.toggleClass( 'is-hidden', null == defaultValue || this.getSettingValue() == defaultValue );
    },

    /**
     * Returns the setting value.
     *
     * @since 1.0.0
     */
    getSettingValue : function() {
        return this.model.setting.get( 'value' );
    },

    /**
     * Updates the setting value.
     *
     * @since 1.0.0
     *
     * @param value
     */
    setSettingValue : function( value ) {
        this.model.setting.set( 'value', value );
    },

    /**
     * Returns the default value for the setting.
     *
     * @since 1.0.0
     */
    getDefaultValue : function() {
        return this.model.setting.get( 'default' );
    },

    /**
     * Restores the default value for the setting.
     *
     * @since 1.0.0
     *
     * @param e
     */
    restoreDefaultValue : function( e ) {
        this.setSettingValue( this.getDefaultValue() );

        this.triggerMethod( 'restore:default' );
    }

} );

module.exports = AbstractControl;
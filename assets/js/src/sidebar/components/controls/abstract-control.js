var $ = window.jQuery,
    AbstractControl;

AbstractControl = Marionette.ItemView.extend( {

    tagName : 'li',

    media : 'desktop',

    ui : {
        'input' : 'input',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },
    
    events : {
        'blur @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

	/**
     * Returns the class name.
     * 
     * @since 1.0.0
     * 
     * @returns {string}
     */
    className : function() {
        return 'control control--' + this.model.get( 'type' );
    },
    
	/**
	 * Returns the template ID.
     * 
     * @since 1.0.0
     * 
     * @returns {string}
     */
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
        data.values = this.getValues();
        data.hideDefault = this.checkDefault( data.values );
        data = this.addSerializedData( data );
        
        return data;
    },
    
    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        return data;
    },
    
	/**
     * Returns true if the Default button should be hidden.
     * 
     * @since 1.7.2
     * 
     * @param values
     * @returns {boolean}
     */
    checkDefault : function( values ) {
        var hide = true;
        _.each( this.getDefaults(), function( value, media ) {
            if (
                ! _.isNull( value ) &&
                values.hasOwnProperty( media ) &&
                ! _.isNull( values[ media ] ) &&
                value !== values[ media ]
            ) {
                hide = false;
            }
        } );
        return hide;
    },

    /**
     * Initializes the control.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.addEventListeners();
        this.checkDependencies();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        _.each( this.getSettings(), function( setting ) {
            this.listenTo( setting, 'change', this.onSettingChange );
        }, this );
        this.listenTo( this.getSetting().collection, 'change', this.checkDependencies );
    },

    /**
     * Checks whether the control should be visible, based on its dependencies.
     *
     * @since 1.0.0
     *
     * @param setting
     */
    checkDependencies : function( setting ) {
        setting = setting || this.getSetting();
        var dependencies = this.model.get( 'dependencies' );
        var settingCollection = setting.collection;
        var visible = true;

        for ( var id in dependencies ) {
            if ( dependencies.hasOwnProperty( id ) ) {
                var target = settingCollection.get( id );
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
	 * Updates the media-query based control groups when the control is rendered.
     * 
     * @since 1.7.2
     */
    onRender : function() {
        this.updateControlGroups();
    },

	/**
     * Displays the appropriate media-query based control group when the Media button is pressed.
     * 
     * @since 1.7.2
     * 
     * @param e
     */
    onMediaButtonChange : function( e ) {
        this.media = e.currentTarget.getAttribute( 'data-media' );
        app.channel.trigger('sidebar:device', this.media);
        this.updateControlGroups();
    },

	/**
     * Restores the default setting values when the Default button is pressed.
     * 
     * @since 1.7.2
     */
    onDefaultButtonChange : function() {
        this.restoreDefaults();
        this.render();
    },

	/**
	 * Updates the current setting value when a field change occurs.
     * 
     * @since 1.7.2
     */
    onFieldChange : function() {
        this.setValue( this.ui.input.filter( '[name^="' + this.media + '"]' ).val() );
    },

	/**
	 * Updates the state of the Default button when a setting value changes.
     * 
     * @since 1.7.2
     */
    onSettingChange : function() {
        this.updateDefaultButton();
    },

	/**
     * Displays the control group associated with the current media query.
     * 
     * @since 1.7.2
     */
    updateControlGroups : function() {
        var media = this.media;

        this.ui.controlGroups.each( function() {
            $( this ).toggleClass( 'is-hidden', media != this.id );
        } );

        this.ui.mediaButton.each( function() {
            $( this ).toggleClass( 'active', media == this.getAttribute( 'data-media' ) );
        } );
    },

	/**
     * Updates the visibility of the Default button.
     * 
     * @since 1.7.2
     */
    updateDefaultButton : function() {
        this.ui.defaultButton.toggleClass( 'is-hidden', this.checkDefault( this.getValues() ) );
    },

	/**
     * Returns all control settings.
     * 
     * @since 1.7.2
     * 
     * @returns {*}
     */
    getSettings : function() {
        return this.model.settings;
    },

	/**
     * Returns the setting associated with a given media query.
     * 
     * @since 1.7.2
     * 
     * @param media
     * @returns {*}
     */
    getSetting : function( media ) {
        media = media || this.media;
        var settings = this.getSettings();
        for ( var i in settings ) {
            if ( settings.hasOwnProperty( i ) ) {
                if ( settings[ i ].media == media ) {
                    return settings[ i ];
                }
            }
        }
        return false;
    },

	/**
	 * Returns the default value for each setting.
     * 
     * @since 1.7.2
     * 
     * @returns {{}}
     */
    getDefaults : function() {
        var defaults = {};
        _.each( this.getSettings(), function( setting ) {
            defaults[ setting.media ] = setting.get( 'default' );
        } );
        return defaults;
    },

	/**
	 * Returns the value for each setting.
     * 
     * @since 1.7.2
     * 
     * @returns {{}}
     */
    getValues : function() {
        var values = {};
        _.each( this.getSettings(), function( setting ) {
            values[ setting.media ] = setting.get( 'value' ) || '';
        } );
        return values;
    },

	/**
     * Returns the default value for the current setting.
     * 
     * @since 1.7.2
     * 
     * @returns {*}
     */
    getDefault : function() {
        return this.getSetting().get( 'default' );
    },

    /**
     * Returns the value for the current setting.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    getValue : function() {
        return this.getSetting().get( 'value' );
    },

    /**
     * Updates value for the current setting.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    setValue : function( value ) {
        this.getSetting().set( 'value', value );
    },

    /**
     * Restores each setting to its default value.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    restoreDefaults : function() {
        _.each( this.getSettings(), function( setting ) {
            setting.set( 'value', setting.get( 'default' ) );
        } );
    }

} );

module.exports = AbstractControl;
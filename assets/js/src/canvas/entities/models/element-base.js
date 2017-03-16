var Model;

/**
 * Wrap `model.set()` and update the internal unsaved changes record keeping.
 *
 * @since 1.0.0
 */
Backbone.Model.prototype.set = _.wrap( Backbone.Model.prototype.set, function( oldSet, key, val, options ) {

    if ( key == null ) return this;

    var attrs;

    if ( typeof key === 'object' ) {
        attrs = key;
        options = val;
    }
    else {
        ( attrs = {} )[ key ] = val;
    }

    options || ( options = {} );

    var ret = oldSet.call( this, attrs, options );

    if ( this._tracking ) {
        _.each( attrs, _.bind( function( val, key ) {
            if ( _.isEqual( this._original[ key ], val ) ) {
                delete this._unsaved[ key ];
            }
            else {
                this._unsaved[ key ] = val;
            }
        }, this ) );
    }

    return ret;

} );

/**
 * Modified implementation of Backbone.trackit
 *
 * @since 1.0.0
 *
 * https://github.com/NYTimes/backbone.trackit
 */
Model = Backbone.Model.extend( {
    _tracking : false,
    _original : {},
    _unsaved: {},

    /**
     * Returns an object containing the default parameters for an element.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {
        return {
            id : this.cid,
            tag : '',
            label : '',
            atts : {},
            parent : '',
            order : 0,
            collection : 'element'
        };
    },

	/**
	 * Returns true if the model is tracking changes.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    isTracking : function() {
        return this._tracking;
    },

    /**
     * Opt in to tracking attribute changes between saves.
     *
     * @since 1.0.0
     *
     * @returns {Backbone.Model}
     */
    startTracking : function() {
        this._tracking = true;
        this.resetTracking();

        return this;
    },

    /**
     * Resets the default tracking values and stops tracking attribute changes.
     *
     * @since 1.0.0
     *
     * @returns {Backbone.Model}
     */
    stopTracking : function() {
        this._tracking = false;
        this._original = {};
        this._unsaved = {};

        return this;
    },

    /**
     * Gets rid of accrued changes and resets state.
     *
     * @since 1.0.0
     *
     * @returns {Backbone.Model}
     */
    resetTracking : function() {
        this._original = _.clone( this.attributes );
        this._unsaved = {};

        return this;
    },

    /**
     * Restores this model's attributes to their original values since tracking started.
     *
     * @since 1.0.0
     *
     * @returns {Backbone.Model}
     */
    resetAttributes: function() {
        if ( ! this._tracking ) { return; }
        this.attributes = this._original;
        this.resetTracking();

        this.trigger( 'change:atts', this, this.get( 'atts' ) );

        return this;
    },

    /**
     * Returns a text shortcode representing the element.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    toShortcode : function() {
        var tag = this.get( 'tag' );
        var atts = this.get( 'atts' );
        var content = '';
        var shortcode = '[' + tag;

        _.each( atts, function( attr, id ) {
	        if ( attr ) {
		        if ( 'content' === id ) {
			        content = attr;
		        }
		        else {

			        if ( _.isNumber( id ) ) {
				        if ( /\s/.test( attr ) ) {
					        shortcode += ' "' + attr + '"';
				        }
				        else {
					        shortcode += ' ' + attr;
				        }
			        }
			        else {
				        shortcode += ' ' + id + '="' + attr + '"';
			        }
		        }
	        }

        }, this );

        return shortcode + ']' + content + '[/' + tag + ']';
    },

    /**
     * Inserts the element before the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.trigger( 'remove:child' );
        this.trigger( 'insert:before', view );
        this.trigger( 'add:child' );

        this.set( 'parent', view.model.get( 'parent' ) );
    },

    /**
     * Inserts the element after the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.trigger( 'remove:child' );
        this.trigger( 'insert:after', view );
        this.trigger( 'add:child' );

        this.set( 'parent', view.model.get( 'parent' ) );
    },

    /**
     * Inserts the element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var model = view.model;
        var parent = model.get( 'parent' );

        if ( 'tailor_column' === model.get( 'tag' ) ) {
            var column = this.collection.createColumn( parent, model.get( 'order' ) - 1 );
            this.collection.insertChild( this, column );
        }
        else {
            var columns = this.collection.createRow( parent, model.get( 'order' ) );
            this.collection.insertChild( this, _.first( columns ) );
            this.collection.insertChild( model, _.last( columns ) );
        }
    },

    /**
     * Inserts the element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var model = view.model;
        var parent = model.get( 'parent' );

        if ( 'tailor_column' === model.get( 'tag' ) ) {
            var column = this.collection.createColumn( parent, ( model.get( 'order' ) ) );
            this.collection.insertChild( this, column );
        }
        else {
            var columns = this.collection.createRow( parent, model.get( 'order' ) );
            this.collection.insertChild( model, _.first( columns ) );
            this.collection.insertChild( this, _.last( columns ) );
        }
    },

	/**
	 * Triggers events before the element has been copied.
	 *
	 * @since 1.0.0
	 *
	 * @param view
	 */
	beforeCopyElement : function( id, view ) {
		view.triggerAll( 'before:element:copy', view );
	},

	/**
	 * Appends a template based on the element to the page.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	appendTemplate : function( id, view ) {
		var oldId = view.model.get( 'id' );
		var template = document.createElement( 'script' );

		template.setAttribute( 'type', 'text/html' );
		template.id = 'tmpl-tailor-' + id;
		template.innerHTML = view.el.outerHTML.replace( oldId, id );

		var templates = document.getElementById( 'tailor-templates' );
		templates.appendChild( template );
	},

	/**
	 * Triggers events after the element has been copied.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	afterCopyElement : function( id, view ) {
		var oldId = view.model.get( 'id' );
		
		/**
		 * Fires after the element has been copied.
		 *
		 * @since 1.0.0
		 */
		view.$el.trigger( 'element:copy', view );

		/**
		 * Fires after an element has been copied.
		 *
		 * @since 1.0.0
		 */
		app.channel.trigger( 'css:copy', oldId, id );
	}

} );

module.exports = Model;

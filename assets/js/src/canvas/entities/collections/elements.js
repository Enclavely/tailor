var ElementCollection = Backbone.Collection.extend( {

    /**
     * Sorts the collection by order.
     *
     * @since 1.0.0
     */
    comparator: 'order',

    /**
     * Returns the appropriate model based on the given tag.
     *
     * @since 1.0.0
     *
     * @param attrs
     * @param options
     * @returns {*|exports|module.exports}
     */
	model : function( attrs, options ) {
        var Model = Tailor.lookup( attrs.tag, attrs.type, 'Models' );
        return new Model( attrs, options );
	},

    /**
     * Initializes the elements collection.
     *
     * @since 1.0.0
     */
	initialize : function() {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'change:parent', this.onChangeParent );
        this.listenTo( this, 'add', this.onAdd );
        this.listenTo( this, 'destroy', this.onDestroy );
        this.listenTo( this, 'container:collapse', this.onCollapse );
        this.listenTo( this, 'reset', this.onReset );
    },

    /**
     * Returns the library collection.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    getElementDefinitions : function() {
        return this.library || app.channel.request( 'sidebar:library' );
    },

    /**
     * Applies default values to the element model.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {*}
     */
    applyDefaults : function( model ) {
        if ( model instanceof Backbone.Model ) {
            model = model.toJSON();
        }

        var definitions = this.getElementDefinitions();
        var item = definitions.findWhere( { tag : model.tag } );
        var defaults = {
            label : item.get( 'label' ),
            type : item.get( 'type' )
        };

        var child = item.get( 'child' );
        if ( child ) {
            defaults.child = child;
        }

        var childViewContainer = item.get( 'child_container' );
        if ( childViewContainer ) {
            defaults.child_container = childViewContainer;
        }

        model.atts = model.atts || {};
        _.each( item.get( 'settings' ), function( setting ) {
            if ( ! _.isEmpty( setting['value'] ) && ! model.atts.hasOwnProperty( setting['id'] ) ) {
                model.atts[ setting['id'] ] = setting['value'];
            }
        } );

        return _.extend( model, defaults );
    },

    /**
     * Returns the parent of a given model.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {*}
     */
    getParent : function( model ) {
        return this.findWhere( { id : model.get( 'parent' ) } );
    },

    /**
     * Returns the siblings for a given element.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {*}
     */
    getChildren : function( model ) {
        return this.where( { parent : model.get( 'id' ) } );
    },

    /**
     * Returns the siblings for a given element.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {*}
     */
    getSiblings : function( model ) {
        return this.where( { parent : model.get( 'parent' ) } );
    },

    /**
     * Returns true if the given element has a selected parent.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {boolean}
     */
    hasSelectedParent : function( model ) {
        var selected = app.channel.request( 'canvas:element:selected' );

        if ( ! selected || model === selected ) {
            return false;
        }

        var parentId = model.get( 'parent' );
        var parent = this.findWhere( { id : parentId } );

        while ( 'undefined' !== typeof parent ) {
            if ( selected === parent ) {
                return true;
            }
            parentId = parent.get( 'parent' );
            parent = this.get( parentId );
        }
        
        return false;
    },

    /**
     * Performs checks on the previous parent when an element changes parent.
     *
     * @since 1.0.0
     *
     * @param model
     */
	onChangeParent : function( model ) {
		var parent = this.get( model.get( 'parent' ) );
		var previousParent = this.get( model.previous( 'parent' ) );

        //console.log( '\n Changed parent of ' + model.get( 'id' ) + ' from ' + model.previous( 'parent' ) + ' to ' + model.get( 'parent' ) );

	    this.sort( { silent : true } );

		this._checkParent( previousParent );

		if ( 'tailor_column' === model.get( 'tag' ) ) {
			this._reBalanceColumns( parent );
			this._reBalanceColumns( previousParent );
		}
	},

    /**
     * Re-balances the columns in a row when a new column is added.
     *
     * @since 1.0.0
     *
     * @param model
     * @param collection
     * @param options
     */
	onAdd : function( model, collection, options ) {

	    //console.log( '\n Added ' + model.get( 'id' ) + ' at ' + model.get( 'order' ) );
        
		if ( 'tailor_column' == model.get( 'tag' ) ) {
			this._reBalanceColumns( this.get( model.get( 'parent' ) ) );
		}
    },

    /**
     * Performs checks on the parent when an element is deleted.
     *
     * @since 1.0.0
     *
     * @param model
     */
	onDestroy : function( model ) {
		var parent = this.get( model.get( 'parent' ) );

        //console.log( '\n Destroyed ' + model.get( 'id' ) );

		this._checkParent( parent );
        var children = this.where( { parent : model.get( 'id' ) } );

        if ( children.length ) {

            // Remove any children of the destroyed element
            _.each( children, function( child ) {
                child.trigger( 'destroy', child, this );
            }, this );
        }

        if ( parent && 'tailor_column' === model.get( 'tag' ) ) {
            this._reBalanceColumns( parent );
        }

        if ( 0 === this.length ) {
            this.onEmpty();
        }
	},

    /**
     * Ensures that the default section/content element is displayed if the canvas is empty following a reset.
     *
     * @since 1.0.0
     */
    onReset : function() {
        if ( 0 === this.length ) {
            this.onEmpty();
        }
    },

    /**
     * Populates the element collection with an empty text element inside a section.
     *
     * @since 1.0.0
     */
    onEmpty : function() {
        var section = this.createSection( 0 );
        this.create( [ {
            tag : 'tailor_content',
            atts : {},
            parent : section.get( 'id' ),
            order : 0
        } ] );
    },

    /**
     * Updates the parent reference for children of a collapsed element.
     *
     * @since 1.0.0
     *
     * @param model
     * @param children
     */
    onCollapse : function( model, children ) {
        var parentId = model.get( 'parent' );

        _.each( children, function( child ) {
            child.set( 'parent', parentId );
        }, this );
    },

	/**
     * Adds a model to the collection.
     * 
     * @since 1.6.1
     * 
     * @param models
     * @param options
     * @returns {*}
     */
    add : function( models, options ) {
        if ( _.isArray( models ) ) {
            _.each( models, this.applyDefaults.bind( this ) );
        }
        else {
            this.applyDefaults( models );
        }
        return this.set( models, _.extend( { merge: false }, options, { add: true, remove: false } ) );
    },

    /**
     * Creates and returns an element model.
     *
     * @since 1.0.0
     *
     * @param models
     * @param options
     * @returns {*}
     */
    create : function( models, options ) {
        options = options || {};

        return this.add( models, options );
    },

    /**
     * Creates and returns a new section.
     *
     * @since 1.0.0
     *
     * @param order
     * @returns {*}
     */
    createSection : function( order ) {
        return _.first( this.create( [ {
            tag : 'tailor_section',
            order : order
        } ], {
            at : order
        } ) );
    },

    /**
     * Creates a new row/column layout based on a parent ID and order and returns the two resulting column models.
     *
     * @since 1.0.0
     *
     * @param parentId
     * @param order
     * @returns {*}
     */
    createRow : function( parentId, order ) {
        var row = _.first( this.create( [ {
            tag : 'tailor_row',
            parent : parentId,
            order : order
        } ], {} ) );

	    //console.log( '\n Created row ' + row.get( 'id' ) + ' at ' + order );

        return this.create( [ {
            tag : 'tailor_column',
            atts : { width : '50%' },
            parent : row.get( 'id' ),
            order : 0
        }, {
            tag : 'tailor_column',
            atts : { width : '50%' },
            parent : row.get( 'id' ),
            order : 1
        } ] );
    },

    /**
     * Creates and returns a new column.
     *
     * @since 1.0.0
     *
     * @param parentId
     * @param order
     * @returns {*}
     */
    createColumn : function( parentId, order ) {
        return _.first( this.create( [ {
			tag : 'tailor_column',
			parent : parentId,
			order : order
		} ] ) );

	    //console.log( '\n Created column ' + column.get( 'id' ) + ' at ' + order );
    },

    /**
     * Creates a new container.
     *
     * @since 1.0.0
     *
     * @param model
     * @param parentId
     * @param order
     * @param descendants
     */
    createContainer : function( model, parentId, order, descendants ) {
        var tag = model.get( 'tag' );
        var container = _.first( this.create( [ {
            tag : tag,
            parent : parentId,
            order : order
        } ], {
            at : order,
            silent : true
        } ) );

        var childTag = model.get( 'child' );
        var children = this.create( [ {
            tag : childTag,
            parent : container.get( 'id' ),
            order : 0
        }, {
            tag : childTag,
            parent : container.get( 'id' ),
            order : 1

        } ], {
            silent : true
        } );

        if ( descendants ) {
            _.first( descendants ).set( 'parent', _.first( children ).get( 'id' ), { silent : true } );
            _.last( descendants ).set( 'parent', _.last( children ).get( 'id' ), { silent : true } );
        }

        this.trigger( 'add', container, this, {} );
    },

    /**
     * Creates and returns a new wrapper element.
     *
     * @since 1.0.0
     *
     * @param tag
     * @param parentId
     * @param order
     * @param child
     * @returns {*}
     */
    createWrapper : function( tag, parentId, order, child ) {
        var wrapper = _.first( this.create( [ {
            tag : tag,
            parent : parentId,
            order : order
        } ], {
            silent : true
        } ) );
        if ( 'undefined' == typeof child ) {
            this.create( [ {
                tag : 'tailor_content',
                parent : wrapper.get( 'id' ),
                order : 0
            } ], {
                silent : true
            } )
        }

        this.trigger( 'add', wrapper, this, {} );
        if ( 'undefined' != typeof child ) {
            this.insertChild( child, wrapper );
        }

        return wrapper;
    },

    /**
     * Adds a child into the specified parent.
     *
     * @since 1.7.3
     *
     * @param model
     */
    createChild : function( model ) {
        var child = _.first( this.create( [ {
            tag : model.get( 'child' ),
            parent : model.get( 'id' ),
            order : this.getChildren( model ).length
        } ], {
            silent : true
        } ) );

        this.create( [ {
            tag : 'tailor_content',
            parent : child.get( 'id' ),
            order : 0
        } ], {
            silent : true
        } );

        this.trigger( 'add', child, this, {} );
        return child;
    },

    /**
     * Inserts a child into the specified parent.
     *
     * @since 1.0.0
     *
     * @param child
     * @param parent
     */
    insertChild : function( child, parent ) {
        if ( ! child ) {
            return;
        }
        if ( child.get( 'parent' ) !== parent.get( 'id' ) ) {
            child.trigger( 'remove:child' );
        }

        parent.trigger( 'insert', child );
        child.trigger( 'add:child' );
        child.set( 'parent', parent.get( 'id' ) );
    },

    /**
     * Re-balances the columns in a given row.
     *
     * @since 1.0.0
     *
     * @param model
     */
    _reBalanceColumns : function( model ) {
        var children = this.where( { parent : model.get( 'id' ) } );
        var numberChildren = children.length;

        _.each( children, function( child ) {
            var atts = _.clone( child.get( 'atts' ) );

            // Update the attributes
            atts['width'] = ( Math.round( parseFloat( 1 / numberChildren ) * 1000 ) / 10 ) + '%';
            delete atts['width_tablet'];
            delete atts['width_mobile'];
            child.set( 'atts', atts, { silent : true } );

            // Trigger change events on the model
            child.trigger( 'change:width', child, atts );
        }, this );
    },

    /**
     * Performs checks on the previous parent when an element changes parent.
     *
     * @since 1.0.0
     *
     * @param model
     */
    _checkParent : function( model ) {
        if ( ! model ) {
            return;
        }
        if ( 'container' == model.get( 'type' ) ) {
            this._checkCollapsibleContainer( model );
        }
        this._checkChildren( model );
    },

    /**
     * Destroys a container element if it is empty.
     *
     * @since 1.0.0
     *
     * @param model
     * @private
     */
    _checkChildren : function( model ) {
        var children = this.where( { parent : model.get( 'id' ) } );
        if ( 0 === children.length ) {
            model.trigger( 'destroy', model );
        }
    },

    /**
     * Checks whether a collapsible container is still valid.
     *
     * @since 1.0.0
     *
     * @param model
     * @private
     */
    _checkCollapsibleContainer : function( model ) {
        var childTag = this.getElementDefinitions().findWhere( { tag : model.get( 'tag' ) } ).get( 'child' ) ;
        var containerId = model.get( 'id' );
        var children = this.filter( function( element ) {
            return containerId === element.get( 'parent' ) && childTag === element.get( 'tag' );
        } );

        // Collapse the container
        if ( 0 === children.length ) {
            model.trigger( 'container:collapse', model, this.where( { parent : containerId } ) );
        }

        // Collapse the only remaining column
        else if ( 1 === children.length ) {
            var child = _.first( children );

            if ( 'tailor_row' === model.get( 'tag' ) ) {
                child.trigger( 'container:collapse', child, this.where( { parent : child.get( 'id' ) } ) );
            }
        }
    }

} );

module.exports = ElementCollection;

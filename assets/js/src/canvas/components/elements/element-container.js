var CompositeView = Marionette.CompositeView.extend( {

    behaviors : {
        Container : {},
        Draggable : {},
        Droppable : {},
        Editable : {},
        Movable : {}
    },

	modelEvents : {
		'change:atts' : 'onChangeAttributes',
		'change:parent' : 'onChangeParent',
		'change:setting' : 'onChangeSetting'
	},

	events : {
		'element:parent:change' : 'stopEventPropagation',
		'before:element:ready' : 'stopEventPropagation',
		'element:ready' : 'stopEventPropagation',
		'before:element:refresh' : 'stopEventPropagation',
		'element:refresh' : 'stopEventPropagation',
		'before:element:destroy' : 'stopEventPropagation',
		'element:destroy' : 'stopEventPropagation',
		'before:element:copy' : 'stopEventPropagation',
		'element:copy' : 'stopEventPropagation',
		'element:child:add' : 'onDescendantAdded',
		'element:child:remove' : 'onDescendantRemoved',
		'before:element:child:ready' : 'stopEventPropagation',
		'element:child:ready' : 'onDescendantReady',
		'before:element:child:refresh' : 'stopEventPropagation',
		'element:child:refresh' : 'stopEventPropagation',
		'before:element:child:destroy' : 'stopEventPropagation',
		'element:child:destroy' : 'onDescendantDestroyed'
	},

	childEvents : {
		'before:element:ready' : 'beforeChildElementReady',
		'element:ready' : 'childElementReady',
		'before:element:refresh' : 'beforeChildElementRefreshed',
		'element:refresh' : 'childElementRefreshed',
		'before:element:destroy' : 'beforeChildElementDestroyed',
		'element:destroy' : 'childElementDestroyed'
	},
	
    /**
     * Initializes the view.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this._isReady = false;
        this._isBeingDestroyed = false;

        this.addEventListeners();
    },

	/**
	 * Adds the required event listeners.
	 *
	 * @since 1.0.0
	 */
    addEventListeners : function() {
        this.listenTo( app.channel, 'before:elements:restore', this.onBeforeDestroy );
    },

    /**
     * Returns the appropriate child view based on the element tag.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
	    return Tailor.lookup( child.get( 'tag' ), child.get( 'type' ), 'Views' );
    },

    /**
     * Provides the element collection to all child elements.
     *
     * @since 1.0.0
     *
     * @param child
     * @param ChildViewClass
     * @param childViewOptions
     * @returns {*}
     */
    buildChildView : function( child, ChildViewClass, childViewOptions ) {
        var options = _.extend({
            model : child,
            collection : this.collection
        }, childViewOptions );

        return new ChildViewClass( options );
    },

    /**
     * Filters the collection to ensure that only the appropriate children are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return child.get( 'parent' ) === this.model.get( 'id' );
    },

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     *
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = jQuery( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'draggable', true );

        return this;
    },

    /**
     * Returns the template ID.
     *
     * @since 1.0.0
     */
    getTemplateId : function() {
        return 'tmpl-tailor-' + this.model.get( 'id' );
    },

    /**
     * Returns the element template.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    getTemplate : function() {
        var el = document.querySelector( '#' + this.getTemplateId() );
        var template;

        if ( el ) {
            template = _.template( el.innerHTML );
            el.parentElement.removeChild( el );
        }
        else {
            el = document.querySelector( '#tmpl-tailor-' + this.model.get( 'tag' ) + '-default' );
            template = _.template( el.innerHTML );
        }

        return template;
    },

    /**
     * Updates the element template with the HTML provided.
     *
     * If the script element containing the element template does not exist in the page, it will be created.
     *
     * @since 1.0.0
     *
     * @param html
     */
    updateTemplate : function( html ) {
        var templateId = this.getTemplateId();
        var el = document.querySelector( '#' + templateId );

        if ( ! el ) {
            el = document.createElement( 'script' );
            el.setAttribute( 'type', 'text/html' );
            el.id = templateId;
            document.body.appendChild( el );
        }

        el.innerHTML = html;
    },

    /**
     * Renders the element template, without affecting child elements.
     *
     * @since 1.0.0
     */
    renderTemplate : function() {
        this._ensureViewIsIntact();

        var $childViewContainer = this.getChildViewContainer( this );
        var $children = $childViewContainer.contents().detach();

        this.resetChildViewContainer();
        this._renderTemplate();

        $childViewContainer = this.getChildViewContainer( this );
        $childViewContainer.append( $children );

        return this;
    },

    /**
     * Updated Marionette function : changed to update the 'order' attribute along with the view _index.
     *
     * @since 1.0.0
     *
     * @param view
     * @param increment
     * @param index
     * @private
     */
    _updateIndices : function( view, increment, index ) {

        if ( increment ) {
            view._index = index;

            //console.log( '\n Updated index of view ' + view.model.get( 'id' ) + ' ' + view.model.get( 'id' ) + ' to ' + index );

            view.model._changing = false;
            view.model.set( 'order', index );
        }

        this.children.each( function( laterView ) {
            if ( laterView._index >= view._index ) {
                laterView._index += increment ? 1 : -1;

                //console.log( '\n Updated index of view ' + laterView.model.get( 'tag' ) + ' ' + laterView.model.get( 'id' ) + ' to ' + laterView._index );

                laterView.model.set( 'order', laterView._index );
            }
        }, this );
    },

	/**
	 * Triggers events before the element is ready.
	 *
	 * @since 1.0.0
	 */
	onBeforeRender : function() {
		this.triggerAll( 'before:element:ready', this );
	},

	/**
	 * Prepares the view and triggers events when the DOM is refreshed.
	 *
	 * @since 1.0.0
	 */
	onDomRefresh : function() {

		this.$el
			.addClass( 'tailor-' + this.model.get( 'id' ) )
			.attr( { draggable: true } )
			.find( 'a' )
			.attr( { draggable : false, target : '_blank' } );

		this.$el
			.find( 'img' )
			.attr( { draggable : false } );
	},

	/**
	 * Triggers events before the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onBeforeDestroy : function() {
		this.triggerAll( 'before:element:destroy', this );
	},

	/**
	 * Triggers an event when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onDestroy : function() {
		this.triggerAll( 'element:destroy', this );
	},
	
	/**
	 * Refreshes the element template when its attributes change.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @param atts
	 */
	onChangeAttributes : _.debounce( function( model, atts ) {
		model = this.model.toJSON();
		model.atts = atts ? atts : {};
		
		var view = this;
		view.el.classList.add( 'is-rendering' );

		window.ajax.send( 'tailor_render', {
			data : {
				model : JSON.stringify( model ),
				nonce : window._nonces.render
			},

			/**
			 * Attaches the refreshed template to the page.
			 *
			 * @since 1.0.0
			 *
			 * @param response
			 */
			success : function( response ) {
				view.updateTemplate( response.html );
				var id = view.model.get( 'id' );
				
				/**
				 * Fires when the custom CSS rules for a given element are updated.
				 *
				 * @since 1.0.0
				 *
				 * @param id
				 * @param response.css
				 */
				app.channel.trigger( 'css:update', id, response.css );
			},

			/**
			 * Catches template rendering errors.
			 *
			 * @since 1.0.0
			 */
			error : function() {
				view.updateTemplate( 'The template for ' + view.cid + ' could not be refreshed' );
			},

			/**
			 * Renders the element with the new template.
			 *
			 * @since 1.0.0
			 */
			complete : function() {
				var isEditing = view.$el.hasClass( 'is-editing' );
				var isSelected = view.$el.hasClass( 'is-selected' );

				view.$el.removeClass( 'is-rendering' );

				/**
				 * Fires before the container template is refreshed.
				 *
				 * @since 1.0.0
				 *
				 * @param compositeView
				 * @param model.atts
				 */
				view.triggerAll( 'before:element:refresh', view, model.atts );

				view.renderTemplate();

				/**
				 * Fires after the container template is refreshed.
				 *
				 * @since 1.0.0
				 *
				 * @param compositeView
				 * @param model.atts
				 */
				view.triggerAll( 'element:refresh', view, model.atts );

				view.refreshChildren();

				if ( isEditing ) {
					view.$el.addClass( 'is-editing' );
				}

				if ( isSelected ) {
					view.$el.addClass( 'is-selected' );
				}
			}
		} );

	}, 250 ),

	/**
	 * Triggers an event to update the DOM, if the setting is configured to update via JavaScript.
	 *
	 * @since 1.5.0
	 *
	 * @param setting
	 * @param refresh
	 */
	onChangeSetting: function( setting, refresh ) {
		if ( refresh ) {

			/**
			 * Fires when an element setting configured to be updated using JavaScript changes.
			 *
			 * @since 1.5.0
			 */
			app.channel.trigger( 'element:setting:change', setting, this );
		}
	},

	/**
	 * Triggers events and refreshes all child elements when the element parent changes.
	 *
	 * @since 1.0.0
	 */
	onChangeParent : function() {

		/**
		 * Fires when the parent attributes of the element changes.
		 *
		 * @since 1.0.0
		 */
		this.triggerAll( 'element:change:parent', this );

		this.refreshChildren();
	},
	
	/**
	 * Triggers an event before a child element is ready.
	 *
	 * @since 1.0.0
	 */
	beforeChildElementReady : function( childView ) {
		if ( this._isReady ) {
			this.triggerAll( 'before:element:child:ready', childView );
		}
	},

	/**
	 * Triggers events after a child element is ready.
	 *
	 * If all children are ready, the element is also considered ready.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childElementReady : function( childView ) {
		if ( ! this._isReady ) {

			var readyChildren = this.children.filter( function( childView ) {
				return childView._isReady;
			} ).length;

			if ( this.children.length == readyChildren ) {
				this._isReady = true;

				/**
				 * Fires when all child elements are ready (i.e., the container is fully-rendered).
				 *
				 * @since 1.0.0
				 */
				this.triggerAll( 'element:ready', this );

				this.refreshChildren();
			}
		}
		else  {

			/**
			 * Fires when a child element within this fully-rendered container is ready.
			 *
			 * @since 1.0.0
			 */
			this.triggerAll( 'element:child:ready', childView );
		}
	},

	/**
	 * Triggers events before a child element template is refreshed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	beforeChildElementRefreshed : function( childView ) {
		this.triggerAll( 'before:element:child:refresh', childView );
	},

	/**
	 * Triggers events after a child element template is refreshed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childElementRefreshed : function( childView ) {
		this.triggerAll( 'element:child:refresh', childView );
	},

	/**
	 * Triggers events before a child element is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	beforeChildElementDestroyed : function( childView ) {
		if ( ! this._isBeingDestroyed ) {
			this.triggerAll( 'before:element:child:destroy', childView );
		}
	},

	/**
	 * Triggers events after a child element is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childElementDestroyed : function( childView ) {
		if ( ! this._isBeingDestroyed && this.children.length > 1 ) {
			this.triggerAll( 'element:child:destroy', childView );
		}
	},

	/**
	 * Refreshes all child elements when the parent element is modified.
	 *
	 * @since 1.0.0
	 */
	onElementParentChange : function() {
		this.refreshChildren();
	},

	/**
	 * Refreshes all child elements when the a child element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onElementChildDestroy : function() {
		this.refreshChildren();
	},

	/**
	 * Triggers events after a child element is added.
	 *
	 * If this container is not fully rendered (i.e., it was created to contain the child element), the element is considered ready.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param descendantView
	 */
	onDescendantAdded : function( e, descendantView ) {
		if ( ! this._isReady ) {

			var readyChildren = this.children.filter( function( childView ) {
				return childView._isReady;
			} ).length;

			if ( this.children.length == readyChildren ) {
				this._isReady = true;

				/**
				 * Fires when all child elements are ready (i.e., the container is fully-rendered).
				 *
				 * @since 1.0.0
				 */
				this.triggerAll( 'element:ready', this );
			}

			e.stopImmediatePropagation();
		}
		else  {

			/**
			 * Fires when a descendant element within this fully-rendered container is ready.
			 *
			 * @since 1.0.0
			 */
			this.triggerAll( 'element:descendant:add', descendantView );

			e.stopPropagation();
		}
	},

	/**
	 * Triggers events after a child element is removed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param descendantView
	 */
	onDescendantRemoved : function( e, descendantView ) {
		if ( ( 'container' == this.model.get( 'type' ) && this.children.length > 1 ) || this.children.length > 0 ) {
			this.triggerAll( 'element:descendant:remove', descendantView );
		}

		e.stopPropagation();
	},

	/**
	 * Triggers events after a child element is ready.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param descendantView
	 */
	onDescendantReady : function( e, descendantView ) {
		if ( ! this._isReady ) {
			if ( this.children.length == 1 && this.children.contains( descendantView ) ) {
				this._isReady = true;

				/**
				 * Fires when all child elements are ready (i.e., the container is fully-rendered).
				 *
				 * @since 1.0.0
				 */
				this.triggerAll( 'element:ready', this );
			}
			e.stopImmediatePropagation();
		}
		else  {

			/**
			 * Fires when a descendant element is created in this fully-rendered container.
			 *
			 * @since 1.0.0
			 */
			this.triggerAll( 'element:descendant:add', descendantView );

			// @todo Find a better way of refreshing complex content elements like carousel galleries
			this.refreshChildren();

			e.stopPropagation();
		}
	},

	/**
	 * Triggers events after a child element is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param descendantView
	 */
	onDescendantDestroyed : function( e, descendantView ) {
		if ( ( 'container' == this.model.get( 'type' ) && this.children.length > 1 ) || this.children.length > 0 ) {

			/**
			 * Fires when a descendant element within in this fully-rendered container is destroyed.
			 *
			 * @since 1.0.0
			 */
			this.triggerAll( 'element:descendant:destroy', descendantView );
		}

		e.stopPropagation();
	},

	/**
	 * Refreshes all child elements.
	 *
	 * @since 1.0.0
	 */
	refreshChildren : function() {
		this.children.each( function( childView ) {
			childView.triggerAll( 'element:parent:change', childView );
		}, this );
	},

	/**
	 * Triggers events and methods during a given event in the lifecycle.
	 *
	 * @since 1.0.0
	 *
	 * @param event
	 * @param view
	 * @param atts
	 */
	triggerAll : function( event, view, atts ) {
		this.$el.trigger( event, view );
		this.triggerMethod( event, view );

		if ( atts ) {
			app.channel.trigger( event, this, atts);
		}
		else {
			app.channel.trigger( event, this );
		}
	},

	/**
	 * Stops the event from bubbling up the DOM tree.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
	stopEventPropagation : function( e ) {
		e.stopPropagation();
	}

} );

module.exports = CompositeView;
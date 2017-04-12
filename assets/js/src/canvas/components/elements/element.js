var $ = window.jQuery,
	ElementView;

ElementView = Marionette.ItemView.extend( {

	className : 'element',

	attributes : {
		draggable : true
	},

	behaviors : {
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
	 * Uses the rendered template HTML as the $el.
	 *
	 * @since 1.0.0
	 *
	 * @param html
	 * @returns {exports}
	 */
	attachElContent : function( html ) {
		var $el = $( html );
		var el = $el[0]; // Fix for elements that contain comments

		this.$el.replaceWith( el );
		this.setElement( el );

		this.el.setAttribute( 'draggable', true );
		this.el.setAttribute( 'tailor-label', this.model.get( 'label' ) );
		this.el.classList.add( 'tailor-' + this.model.id );
		this.el.title = _l10n.edit_element;
		
		return this;
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
	 * Refreshes the element template when the element attributes change.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @param atts
	 */
	onChangeAttributes :  _.debounce( function( model, atts ) {
		var view = this;
		
		model = model.toJSON();
		if ( atts ) {
			model.atts = atts;
		}
		
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
				
				/**
				 * Fires when the custom CSS rules for a given element are updated.
				 *
				 * @since 1.0.0
				 */
				app.channel.trigger( 'css:update', view.model.get( 'id' ), response.css );
			},

			/**
			 * Catches template rendering errors.
			 *
			 * @since 1.0.0
			 */
			error : function( response ) {
				view.updateTemplate( '<p class="tailor-notification tailor-notification--error">The template for ' + view.cid + ' could not be refreshed</p>' );
				console.error( response );
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
				 */
				view.triggerAll( 'before:element:refresh', view, model.atts );

				view.render();

				/**
				 * Fires after the container template is refreshed.
				 *
				 * @since 1.0.0
				 */
				view.triggerAll( 'element:refresh', view, model.atts );

				if ( isEditing ) {
					view.$el.addClass( 'is-editing' );
				}

				if ( isSelected ) {
					view.$el.addClass( 'is-selected' );
				}
			}
		} );

	}, 500 ),

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
			 * Fires before the element is refreshed using JavaScript.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'before:element:jsRefresh', this, this.model.get( 'atts' ) );
			
			/**
			 * Fires when an element setting is changed.
			 *
			 * This is only fired when the setting is configured for JavaScript updates.
			 *
			 * @since 1.5.0
			 */
			app.channel.trigger( 'element:setting:change', setting, this );

			/**
			 * Fires after the element is refreshed using JavaScript.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'element:jsRefresh', this, this.model.get( 'atts' ) );
		}
	},

	/**
	 * Triggers events when the element parent changes.
	 *
	 * @since 1.0.0
	 */
	onChangeParent : function() {
		this.triggerAll( 'element:change:parent', this );
	},

	/**
	 * Triggers an event on the application channel before the DOM element is rendered.
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
		var view = this;
		
		this.$el
			.find( 'a' )
			.attr( { draggable : false, target : '_blank' } );

		this.$el
			.find( '[onchange]' )
			.removeAttr( 'onchange' );

		this.$el
			.find( 'img' )
			.attr( { draggable : false } );

		this.$el.imagesLoaded( function() {
			view._isReady = true;

			// Display the empty element message for widgets that do not produce any visible content
			if ( view.el.classList.contains( 'tailor-widget' ) && 0 == view.$el.children().innerHeight() ) {
				var el = document.querySelector( '#tmpl-tailor-element-empty' );
				if ( el ) {
					view.$el.html( el.innerHTML );
				}
			}

			/**
			 * Fires when the element is rendered and all images have been loaded.
			 *
			 * @since 1.0.0
			 * 
			 * @param view
			 */
			view.triggerAll( 'element:ready', view );
		} );
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
	}

} );

module.exports = ElementView;
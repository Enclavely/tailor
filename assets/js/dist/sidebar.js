(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * The Sidebar Marionette application.
 */
var $ = Backbone.$,
    SidebarApplication;

SidebarApplication = Marionette.Application.extend( {

	el : document.querySelector( '#tailor' ),

    /**
     * Initializes the application.
     *
     * @since 1.0.0
     */
	initialize : function() {
        this._collapsed = false;
        this._unsavedChanges = false;
        this.saveButton = document.querySelector( '#tailor-save' );
        this.allowableEvents = [
	        'element:add', 'element:move', 'element:resize', 'element:change:order', 'element:copy', 'element:delete', // 'element:edit',
	        'elements:restore', 'elements:reset',
            'modal:open', 'modal:destroy',
            'template:add'
        ];

        this.addEventListeners();
    },

    /**
     * Returns true if there are unsaved changes.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    hasUnsavedChanges : function() {
        return this._unsavedChanges;
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        var sidebarApp = this;

        /**
         * Updates the Save button and adds a confirmation prompt to the window when a change occurs.
         *
         * @since 1.0.0
         */
        sidebarApp.onSettingChange = function() {
            sidebarApp.saveButton.disabled = false;
            sidebarApp.saveButton.innerHTML = window._l10n.publish;
            sidebarApp._unsavedChanges = true;
        };

        sidebarApp.listenTo( sidebarApp.channel, 'sidebar:setting:change', sidebarApp.onSettingChange );
        sidebarApp.listenTo( sidebarApp.channel, _.without( sidebarApp.allowableEvents, 'modal:open', 'modal:destroy' ).join( ' ' ), sidebarApp.onSettingChange );
        sidebarApp.listenTo( sidebarApp.channel, [ 'modal:apply' ].join( ' ' ), sidebarApp.onSettingChange );

        /**
         * Collapses the Sidebar when the Collapse button is selected.
         *
         * @since 1.0.0
         */
        sidebarApp.onCollapse = function() {
            sidebarApp._collapsed = ! sidebarApp._collapsed;
            sidebarApp.el.classList.toggle( 'is-collapsed', sidebarApp._collapsed );
            sidebarApp.saveButton.setAttribute( 'aria-expanded', ! sidebarApp._collapsed );

            /**
             * Fires before the application closes.
             *
             * @since 1.0.0
             */
            sidebarApp.triggerMethod( 'collapse:sidebar' );
        };

        var collapseButton = document.querySelector( '#tailor-collapse' );
        collapseButton.addEventListener( 'click', sidebarApp.onCollapse );

        /**
         * Saves settings and elements and updates the sidebar.
         *
         * @since 1.0.0
         */
        sidebarApp.onSave = function() {
	        sidebarApp.el.classList.add( 'is-saving' );
            sidebarApp.saveButton.setAttribute( 'disabled', true );

            var models = sidebarApp.channel.request( 'canvas:elements' );
            var settings = sidebarApp.channel.request( 'sidebar:settings' );
            var options = {
                data : {
                    post_id : window.post.id,
                    models : JSON.stringify( models.toJSON() ),
                    settings : JSON.stringify( settings.toJSON() ),
                    nonce : window._nonces.save
                },

	            /**
	             * Updates the sidebar after a save action is completed successfully.
	             *
	             * @since 1.0.0
	             */
                success : function() {
                    sidebarApp.saveButton.disabled = true;
                    sidebarApp.saveButton.innerHTML = window._l10n.saved;
                    sidebarApp._unsavedChanges = false;

                    /**
                     * Fires when changes are successfully saved.
                     *
                     * @since 1.0.0
                     */
                    sidebarApp.channel.trigger( 'sidebar:save' );
                },

                error: function( response ) {

                    sidebarApp.saveButton.disabled = false;

                    if ( response && response.hasOwnProperty( 'message' ) ) {

                        // Display the error from the server
                        Tailor.Notify( response.message );
                    }
                    else if ( '0' == response ) {

                        // Session expired
                        Tailor.Notify( window._l10n.expired );
                    }
                    else if ( '-1' == response ) {

                        // Invalid nonce
                        Tailor.Notify( window._l10n.invalid );
                    }
                    else {

                        // General error condition
                        Tailor.Notify( window._l10n.error );
                    }
                },

	            /**
	             * Updates the sidebar after a save action is completed.
	             *
	             * @since 1.0.0
	             */
                complete : function( response ) {
                    sidebarApp.el.classList.remove( 'is-saving' );
                }
            };

            window.ajax.send( 'tailor_save', options );
        };

        sidebarApp.saveButton.addEventListener( 'click', sidebarApp.onSave );
        sidebarApp.listenToOnce( sidebarApp.channel, 'canvas:initialize', sidebarApp.registerRemoteChannel );

        $( document ).on( 'keydown', function( e ) {
            if ( e.ctrlKey && 89 == e.keyCode ) {
                if ( ! _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {

                    /**
                     * Fires when a "CTRL-Y" is pressed.
                     *
                     * @since 1.0.0
                     */
                    sidebarApp.channel.trigger( 'history:redo' );
                }
            }
        } );

        $( document ).on( 'keydown', function( e ) {
            if ( e.ctrlKey && 90 == e.keyCode ) {
                if ( ! _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {

                    /**
                     * Fires when a "CTRL-Z" is pressed.
                     *
                     * @since 1.0.0
                     */
                    sidebarApp.channel.trigger( 'history:undo' );
                }
            }
        } );
    },

    /**
     * Registers the remote window Radio channel.
     *
     * @since 1.0.0
     */
    registerRemoteChannel : function() {
        var sidebarApp = this;
        var iFrame = this.el.querySelector( '#tailor-sidebar-preview' );
        if ( window.location.origin === iFrame.contentWindow.location.origin ) {
            var remoteChannel = iFrame.contentWindow.app.channel;

            /**
             * Returns the element collection from the remote window.
             *
             * @since 1.0.0
             */
            var getElements = function( id ) {
                return remoteChannel.request( 'canvas:elements', id );
            };

            /**
             * Returns the history entry collection from the remote window.
             *
             * @since 1.0.0
             */
            var getHistory = function( id ) {
                return remoteChannel.request( 'sidebar:history', id );
            };

            /**
             * Returns the selected element (if any) from the remote window.
             *
             * @since 1.0.0
             */
            var getSelectedElement = function() {
                return remoteChannel.request( 'canvas:element:selected' );
            };

            app.channel.reply( 'canvas:elements', getElements );
	        app.channel.reply( 'sidebar:history', getHistory );
	        app.channel.reply( 'canvas:element:selected', getSelectedElement );

            sidebarApp.listenTo( remoteChannel, 'all', sidebarApp.forwardRemoteEvent );

            sidebarApp.el.classList.add( 'is-initialized' );
            sidebarApp.el.querySelector( '.tailor-preview__viewport' ).classList.add( 'is-loaded' );

            /**
             * Fires when the sidebar is initialized.
             *
             * @since 1.0.0
             */
            remoteChannel.trigger( 'sidebar:initialize' );
        }
    },

    /**
     * Forwards specific events from the remote communication channel.
     *
     * @since 1.0.0
     */
    forwardRemoteEvent : function( eventName ) {
        var validEvent = _.contains( this.allowableEvents, eventName );
        if ( validEvent ) {
            this.channel.trigger.apply( this.channel, arguments );
        }
    },

    /**
     * Triggers the collapse method if the Collapse button is selected using the Enter key.
     *
     * @since 1.0.0
     */
    maybeCollapse : function( e ) {
        if ( 13 === e.keyCode ) {
            this.onCollapse();
        }
    },

    /**
     * Triggers the save method if the Save button is selected using the Enter key.
     *
     * @since 1.0.0
     */
    maybeSave : function( e ) {
        if ( 13 === e.keyCode ) {
            this.onSave();
        }
    }

} );

module.exports = SidebarApplication;
},{}],2:[function(require,module,exports){
var callbacks = {};

/**
 * Triggers registered callback functions when a setting value changes.
 *
 * @since 1.0.0
 *
 * @param setting
 */
var onChange = function( setting ) {
    var settingId = setting.get( 'id' );
    if ( callbacks[ settingId ] ) {
        _.each( callbacks[ settingId ], function( callback ) {
            callback.apply( app, [ setting.get( 'value' ), setting.previous( 'value' ) ] );
        } );
    }
};

app.listenTo( app.channel, 'sidebar:setting:change', onChange );

/**
 * A simple API for registering a callback function to be applied when a given setting changes.
 *
 * @since 1.0.0
 *
 * @param id
 * @param callback
 */
module.exports = function( id, callback ) {
    if ( 'function' === typeof callback ) {
        callbacks[ id ] = callbacks[ id ] || [];
        callbacks[ id ].push( callback );
    }
};
},{}],3:[function(require,module,exports){
/**
 * Tailor.Behaviors.Draggable
 *
 * Draggable element behaviors.
 *
 * @augments Marionette.Behavior
 */
module.exports = Marionette.Behavior.extend( {

	events : {
		'dragstart' : 'onDragStart',
		'dragend' : 'onDragEnd',
		'drag' : 'onDrag'
	},

    /**
     * Triggers an event when dragging starts.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onDragStart : function( e ) {
        app.channel.trigger( 'canvas:dragstart', e.originalEvent, this.view );
	},

	/**
	 * Triggers an event while dragging.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
	onDrag : function( e ) {
		app.channel.trigger( 'canvas:drag', e.originalEvent, this.view );
	},

    /**
     * Triggers an event when dragging ends.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onDragEnd : function( e ) {
        app.channel.trigger( 'canvas:dragend', e.originalEvent, this.view );
	}

} );
},{}],4:[function(require,module,exports){
/**
 * Tailor.Behaviors.Panel
 *
 * Panel behaviors.
 *
 * @augments Marionette.Behavior
 */
module.exports = Marionette.Behavior.extend( {

    ui: {
        backButton : '.back-button',
        helpButton : '.help-button',
        helpDescription : '.help-description',
        searchBar : '.search'
    },

    events : {
        'click @ui.helpButton': 'toggleHelp',
        'change @ui.searchBar' : 'doSearch',
        'input @ui.searchBar': 'doSearch',
        'keyup @ui.searchBar': 'doSearch',
        'search @ui.searchBar': 'doSearch'
    },

    triggers : {
        'click @ui.backButton': 'back'
    },

    /**
     * Toggles the help text when the Help button is pressed.
     *
     * @since 1.0.0
     */
    toggleHelp : function() {
        this.ui.helpButton.toggleClass( 'is-open' );
        this.ui.helpDescription.slideToggle( 150 );
    },

    /**
     * Performs a collection search based on the search criteria provided.
     *
     * @since 1.0.0
     *
     * @param e
     */
    doSearch : function( e ) {
        this.view.collection.doSearch( e.target.value );
    }

} );
},{}],5:[function(require,module,exports){
/**
 * Tailor.Behaviors.Resizable
 *
 * Resizable element behaviors.
 *
 * @augments Marionette.Behavior
 */
module.exports = Marionette.Behavior.extend( {

    ui : {
        handle : '.modal__title'
    },

    events : {
        'mousemove' : 'onMouseMove',
        'mousedown' : 'onMouseDown',
        'dblclick @ui.handle' : 'toggleFullScreen'
    },

    /**
     * Creates and inserts the insertion pane into the page.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this._isResizing = false;
        this._isResizing = false;
        this.$ghostPane = jQuery( '<div class="ghost-pane"></div>' ).appendTo( 'body' );

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        var behavior = this;
        window.addEventListener( 'resize', function() {
            behavior.checkPosition();
        }, false );
    },

    /**
     * Returns the edges of the modal window that the mouse is currently over (if any).
     *
     * @since 1.0.0
     *
     * @param e
     * @returns {Array}
     */
    detectEdges : function( e ) {
        var rect = this.el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var threshold = 8;
        var edges = [];

        // Top
        if ( y < threshold ) {
            edges.push( 'top' );
        }

        // Bottom
        if ( y >= ( rect.height - threshold ) ) {
            edges.push( 'bottom' );
        }

        // Left
        if ( x < threshold ) {
            edges.push( 'left' );
        }

        // Right
        if ( x >= ( rect.width - threshold ) ) {
            edges.push( 'right' );
        }
        return edges;
    },

    /**
     * Adds a class name to the modal window associated with the possible drag action.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onMouseMove: function( e ) {
        if ( this._isResizing || this._isDragging ) {
            return;
        }

        this.$el.removeClass( 'top top-left top-right left right bottom bottom-left bottom-right is-draggable' );

        var edges = this.detectEdges( e );
        if ( edges.length && ! this.container.classList.contains( 'is-full-screen' ) && ! document.body.classList.contains( 'mce-fullscreen' ) ) {
            this.$el.addClass( edges.join( '-' ) );
        }
        else if ( e.target.classList.contains( 'modal__title' ) ) {
            this.el.classList.add( 'is-draggable' );
        }
    },

    /**
     * Initiates the drag or resize action, if appropriate.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onMouseDown : function( e ) {
        if ( this._isResizing || this._isDragging ) {
            return;
        }

        var edges = this.detectEdges( e );
        if ( edges.length && ! this.$container.hasClass( 'is-full-screen' ) && ! document.body.classList.contains( 'mce-fullscreen' ) ) {
            this.resize( e, edges );
        }
        else if ( e.target === this.ui.handle.get(0) ) {
            this.drag( e );
        }
    },

    /**
     * Updates the width and height of the modal window when the user resizes it.
     *
     * @since 1.0.0
     *
     * @param e
     * @param edges
     */
    resize : function( e, edges ) {
        var that = this;
        var edge = edges.join( '-' );
        var direction = ( _.contains( edges, 'top' ) || _.contains( edges, 'left' ) ) ? -1 : 1;

        this._isResizing = true;

        document.body.classList.add( 'is-dragging' );
        document.addEventListener( 'mousemove', onResize, false );
        document.addEventListener( 'mouseup', onResizeEnd, false );

        var lastX = e.pageX;
        var lastY = e.pageY;
        var lastWidth = parseInt( that.container.style.width, 10 );
        var lastHeight = parseInt( that.container.style.height, 10 );

        /**
         * Updates the width and height of the modal window as it is resized.
         *
         * @since 1.0.0
         *
         * @param e
         */
        function onResize( e ) {
            var xDifference = ( direction * ( e.pageX - lastX ) );
            var yDifference = ( direction * ( e.pageY - lastY ) );

            switch ( edge ) {

                case 'top':
                    lastHeight = lastHeight + yDifference;
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                        that.container.style.top = ( parseInt( that.container.style.top, 10 ) - yDifference ) + 'px';
                    }
                    break;

                case 'bottom':
                    lastHeight = lastHeight + yDifference;
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                    }
                    break;

                case 'left':
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                        that.container.style.left = ( parseInt( that.container.style.left, 10 ) - xDifference ) + 'px';
                    }
                    break;

                case 'right':
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                    }
                    break;

                case 'top-left':
                    lastHeight = lastHeight + yDifference;
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                        that.container.style.left = ( parseInt( that.container.style.left, 10 ) - xDifference ) + 'px';
                    }
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                        that.container.style.top = ( parseInt( that.container.style.top, 10 ) - yDifference ) + 'px';
                    }
                    break;

                case 'top-right':
                    lastHeight = lastHeight + yDifference;
                    lastWidth = lastWidth - xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                    }
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                        that.container.style.top = ( parseInt( that.container.style.top, 10 ) - yDifference ) + 'px';
                    }
                    break;

                case 'bottom-left':
                    lastHeight = lastHeight - yDifference;
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                        that.container.style.left = ( parseInt( that.container.style.left, 10 ) - xDifference ) + 'px';
                    }
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                    }
                    break;

                case 'bottom-right':
                    lastHeight = lastHeight + yDifference;
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                    }
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                    }
                    break;
            }

            that.triggerResize( lastWidth, lastHeight );

            lastY = e.pageY;
            lastX = e.pageX;
        }

        /**
         * Removes event listeners and checks to ensure that the final size is valid.
         *
         * @since 1.0.0
         *
         * @param e
         */
        function onResizeEnd( e ) {
            that._isResizing = false;

            document.body.classList.remove( 'is-dragging' );
            document.removeEventListener( 'mousemove', onResize, false );
            document.removeEventListener( 'mouseup', onResizeEnd, false );

            that.checkPosition( 150 );
        }
    },

    /**
     * Updates the position of the modal window when the user drags it.
     *
     * @since 1.0.0
     *
     * @param e
     */
    drag : function( e ) {
        var that = this;
        var lastX;
        var lastY;

        this._isDragging = true;

        document.addEventListener( 'mousemove', onDrag, false );
        document.addEventListener( 'mouseup', onDragEnd, false );

        /**
         * Updates the top and left position of the modal window as it is dragged.
         *
         * @since 1.0.0
         *
         * @param e
         */
        function onDrag( e ) {
            document.body.classList.add( 'is-dragging' );

            that.container.style.top = parseInt( that.container.style.top, 10 ) + ( e.pageY - lastY ) + 'px';
            that.container.style.left = parseInt( that.container.style.left, 10 ) + ( e.pageX - lastX ) + 'px';

            if ( e.pageX < 5 ) {
                that.$ghostPane.css( { display: 'block' } ).addClass( 'left' );
            }
            else if ( e.pageX > ( window.innerWidth - 5 ) ) {
                that.$ghostPane.css( { display: 'block' } ).addClass( 'right' );
            }
            else if ( e.pageY < 5 ) {
                that.$ghostPane.css( { display: 'block' } ).addClass( 'top' );
            }
            else {

                that.resetGhostPane();

                if ( that.container.classList.contains( 'is-full-screen' ) ) {
                    that.$container.removeClass( 'is-full-screen is-full-screen-left is-full-screen-right' );
                    that.container.style.top = ( e.pageY - 20 ) + 'px';
                    that.container.style.left = ( e.pageX - ( parseInt( that.container.style.width, 10 ) / 2 ) ) + 'px';

                    that.triggerResize( parseInt( that.container.style.width, 10 ), parseInt( that.container.style.height, 10 ) );
                }
            }

            lastX = e.pageX;
            lastY = e.pageY;
        }

        /**
         * Removes event listeners and checks to ensure that the final position is valid.
         *
         * @since 1.0.0
         *
         * @param e
         */
        function onDragEnd( e ) {
            that._isDragging = false;

            document.body.classList.remove( 'is-dragging' );
            document.removeEventListener( 'mousemove', onDrag, false );
            document.removeEventListener( 'mouseup', onDragEnd, false );

            that.maybeToggleFullScreen( e );
        }
    },

	/**
     * Toggles full-screen mode if the modal window is dragged to the left, right or top of the screen.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeToggleFullScreen : function( e ) {
        var position;

        if ( e.pageY < 5 ) {
            position = 'top';
        }
        else if ( e.pageX < 5 ) {
            position = 'left';
        }
        else if ( e.pageX > ( window.innerWidth - 5 ) ) {
            position = 'right';
        }

        if ( position ) {
            this.enterFullScreen( position );
        }
        else {
            this.checkPosition( 150 );
        }
    },

    /**
     * Toggles full-screen mode.
     *
     * @since 1.0.0
     */
    toggleFullScreen : function() {
        if ( ! this.container.classList.contains( 'is-full-screen' ) ) {
            this.enterFullScreen( 'top' );
        }
        else {
            this.exitFullScreen();
        }
    },

	/**
     * Enters full-screen mode.
     *
     * @since 1.0.0
     *
     * @param position
     */
    enterFullScreen : function( position ) {
        this.$container.removeClass( 'is-full-screen is-full-screen-left is-full-screen-right' );
        this.container.classList.add( 'is-full-screen' );
        this.container.classList.add( 'is-full-screen-' + position );

        var rect = this.container.getBoundingClientRect();
        this.triggerResize( rect.width, rect.height );
    },

	/**
     * Exits full-screen mode.
     *
     * @since 1.0.0
     */
    exitFullScreen : function() {
        this.$container.removeClass( 'is-full-screen is-full-screen-left is-full-screen-right' );

        this.triggerResize( parseInt( this.container.style.width, 10 ), parseInt( this.container.style.height, 10 ) );
        this.checkPosition( 150 );
        this.resetGhostPane();
    },

    /**
     * Fires a refresh event based on the inline width and height.
     *
     * @since 1.0.0
     *
     * @param width
     * @param height
     */
    triggerResize : function( width, height ) {

	    /**
	     * Fires when the element is resized.
         *
         * @since 1.0.0
         */
        this.view.trigger( 'modal:resize', width, height );
    },

	/**
     * Hides the ghost pane.
     *
     * @since 1.0.0
     */
    resetGhostPane : function() {
        this.$ghostPane.css( { display: 'none' } );
        this.$ghostPane[0].className = 'ghost-pane';
    },

    /**
     * Sets the initial focus and checks the position of the modal window when it is first shown.
     *
     * @since 1.0.0
     */
    onShow : function() {
        this.container = this.el.parentNode;
        this.$container = this.$el.parent();

        this.checkPosition();
    },

    /**
     * Ensures that the modal window is positioned inside the viewport.
     *
     * @since 1.0.0
     *
     * @param duration
     */
    checkPosition : function( duration ) {
        duration = duration || 0;

        var width = parseInt( this.container.style.width, 10 );
        var height = parseInt( this.container.style.height, 10 );
        var top = parseInt( this.container.style.top, 10 );
        var left = parseInt( this.container.style.left, 10 );
        var css = {};

        if ( top < window.scrollY ) {
            css.top = window.scrollY;
        }
        else if ( ( top + height ) > ( window.scrollY + window.innerHeight ) ) {
            css.top = Math.max( window.scrollY + window.innerHeight - height, window.scrollY );
        }

        if ( left < 0 ) {
            css.left = window.scrollX;
        }
        else if ( ( left + width ) > ( window.scrollX + window.innerWidth ) ) {
            css.left = Math.max( window.scrollX + window.innerWidth - width, window.scrollX );
        }

        if ( duration ) {
            this.$container.animate( css, duration );
        }
        else {
            this.$container.css( css );
        }
    },

    /**
     * Removes the ghost pane.
     *
     * @since 1.0.0
     */
    onDestroy  : function() {
        this.$ghostPane.remove();
    }

} );
},{}],6:[function(require,module,exports){
/**
 * An abstract control.
 *
 * @augments Marionette.ItemView
 */
module.exports = Marionette.ItemView.extend( {

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

                if ( ! this.checkCondition( condition, actual, required ) ) {
                    visible = false;
                    break;
                }
            }
        }

        this.$el.toggle( visible );
    },

    /**
     * Evaluates whether the given condition is true, given two values.
     *
     * @since 1.0.0
     *
     * @param actual
     * @param condition
     * @param required
     * @returns {*}
     */
    checkCondition : function( condition, actual, required ) {
        switch ( condition ) {

            case 'equals' :
                return actual === required;

            case 'not':
                if ( _.isArray( required ) ) {
                    return -1 === required.indexOf( actual );
                }
                return actual !== required;

            case 'lessThan':
                return ( actual < parseInt( required, 10 ) );

            case 'greaterThan':
                return ( actual > parseInt( required, 10 ) );

            case 'contains' :
                if ( _.isString( actual ) ) {
                    actual = actual.split( ',' );
                }
                if ( _.isArray( required ) ) {
                    var intersection = _.intersection( required, actual );
                    return 0 !== intersection.length;
                }
                return -1 !== _.indexOf( actual, required );
        }
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        this.setSettingValue( this.ui.input.val() );
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
},{}],7:[function(require,module,exports){
/**
 * Tailor.Controls.ButtonGroup
 *
 * A button group control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
	AbstractControl = require( './abstract-control' ),
	ButtonGroupControl;

ButtonGroupControl = AbstractControl.extend( {

	ui: {
		'input' : 'button',
        'default' : '.js-default'
	},

    events : {
        'click @ui.input' : 'onControlChange',
        'click @ui.default' : 'restoreDefaultValue'
    },

    templateHelpers : {

        /**
         * Returns the appropriate class name if the current button is the selected one.
         *
         * @since 1.0.0
         *
         * @param button
         * @returns {string}
         */
        active : function( button ) {
            return button === this.value ? 'active' : '';
        }
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
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {

        var button = e.currentTarget;

        this.ui.input.removeClass( 'active' );
        button.classList.add( 'active' );
        this.setSettingValue( button.value );
    }

} );

module.exports = ButtonGroupControl;
},{"./abstract-control":6}],8:[function(require,module,exports){
/**
 * Tailor.Controls.Checkbox
 *
 * A checkbox control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
	CheckboxControl;

CheckboxControl = AbstractControl.extend( {

    ui : {
        'input' : 'input',
        'default' : '.js-default'
    },

    templateHelpers : {

        /**
         * Returns "checked" if the current choice is the selected one.
         *
         * @since 1.0.0
         *
         * @param choice
         * @returns {string}
         */
        checked : function( choice ) {
            var value = this.value.split( ',' );
            return -1 !== value.indexOf( choice ) ? 'checked' : '';
        }
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
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {

        var value = [];

        _.each( this.ui.input, function( input ) {
            if ( input.checked ) {
                value.push( input.value );
            }
        } );

        this.setSettingValue( value.join( ',' ) );
    }

} );

module.exports = CheckboxControl;
},{"./abstract-control":6}],9:[function(require,module,exports){
/**
 * Tailor.Controls.Code
 *
 * A code editor control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
	AbstractControl = require( './abstract-control' ),
	CodeControl;

CodeControl = AbstractControl.extend( {

    ui : {
        'input' : 'textarea',
        'default' : '.js-default'
    },

    events : {
        'click @ui.default' : 'restoreDefaultValue'
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
        data.showDefault = null != defaultValue && data.value != defaultValue;
        data.cid = this.cid;

        return data;
    },

    /**
     * Initializes the editor.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var obj = this;
        var mode = this.model.get( 'mode' );

        obj.editor = CodeMirror.fromTextArea( this.ui.input.get(0), {
			mode : mode,
			lineNumbers : true,
			matchBrackets : true,
			continueComments : 'Enter',
			viewportMargin : Infinity,
			extraKeys : {

				'F11' : function( cm ) {
					cm.setOption( 'fullScreen', ! cm.getOption( 'fullScreen' ) );
				},

				'Esc' : function( cm ) {
					if ( cm.getOption( 'fullScreen' ) )  {
						cm.setOption( 'fullScreen', false );
					}
				}
			}
		} );

        var onControlChange = function( editor ) {
            obj.setSettingValue( editor.getValue() );
        };

        this.editor.on( 'change', onControlChange );
    },

    /**
     * Restores the default value for the setting.
     *
     * @since 1.0.0
     *
     * @param e
     */
    restoreDefaultValue : function( e ) {
        var value = this.getDefaultValue();
        this.setSettingValue( value );
        this.editor.setValue( value );
    },

    /**
     * Destroys the editor instance when the control is destroyed.
     *
     * @since 1.0.0
     */
	onDestroy : function() {
        this.editor.off( 'change', this.onChange );
		this.editor.toTextArea();
	}

} );

module.exports = CodeControl;
},{"./abstract-control":6}],10:[function(require,module,exports){
/**
 * Tailor.Controls.ColorPicker
 *
 * A color picker control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    ColorPickerControl;

/**
 * wp-color-picker-alpha
 *
 * Overwrite Automattic Iris for enabled Alpha Channel in wpColorPicker
 *
 * Version: 1.2
 *
 * https://github.com/23r9i0/wp-color-picker-alpha
 * Copyright (c) 2015 Sergio P.A. (23r9i0).
 * Licensed under the GPLv2 license.
 */
( function( $ ) {

    // Variable for some backgrounds
    var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAAHnlligAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHJJREFUeNpi+P///4EDBxiAGMgCCCAGFB5AADGCRBgYDh48CCRZIJS9vT2QBAggFBkmBiSAogxFBiCAoHogAKIKAlBUYTELAiAmEtABEECk20G6BOmuIl0CIMBQ/IEMkO0myiSSraaaBhZcbkUOs0HuBwDplz5uFJ3Z4gAAAABJRU5ErkJggg==';

    // html stuff for wpColorPicker copy of the original color-picker.js
    var	_before = '<a tabindex="0" class="wp-color-result" />',
        _after = '<div class="wp-picker-holder" />',
        _wrap = '<div class="wp-picker-container" />',
        _button = '<input type="button" class="button button-small hidden" />';

    /**
     * Overwrite Color for enable support rbga
     */
    Color.fn.toString = function() {
        if ( this._alpha < 1 )
            return this.toCSS( 'rgba', this._alpha ).replace( /\s+/g, '' );

        var hex = parseInt( this._color, 10 ).toString( 16 );

        if ( this.error )
            return '';

        if ( hex.length < 6 ) {
            for ( var i = 6 - hex.length - 1; i >= 0; i-- ) {
                hex = '0' + hex;
            }
        }

        return '#' + hex;
    };

    /**
     * Overwrite wpColorPicker
     */
    $.widget( 'wp.wpColorPicker', $.wp.wpColorPicker, {

        _create: function() {
            // bail early for unsupported Iris.
            if ( ! $.support.iris ) {
                return;
            }

            var self = this,
                el = self.element;

            $.extend( self.options, el.data() );

            // keep close bound so it can be attached to a body listener
            self.close = $.proxy( self.close, self );

            self.initialValue = el.val();

            // Set up HTML structure, hide things
            el.addClass( 'wp-color-picker' ).hide().wrap( _wrap );
            self.wrap = el.parent();
            self.toggler = $( _before ).insertBefore( el ).css( { backgroundColor: self.initialValue } ).attr( 'title', wpColorPickerL10n.pick ).attr( 'data-current', wpColorPickerL10n.current );
            self.pickerContainer = $( _after ).insertAfter( el );
            self.button = $( _button );

            if ( self.options.defaultColor ) {
                self.button.addClass( 'wp-picker-default' ).val( wpColorPickerL10n.defaultString );
            } else {
                self.button.addClass( 'wp-picker-clear' ).val( wpColorPickerL10n.clear );
            }

            el.wrap( '<span class="wp-picker-input-wrap" />' ).after(self.button);

            el.iris( {
                target: self.pickerContainer,
                hide: self.options.hide,
                width: self.options.width,
                mode: self.options.mode,
                palettes: self.options.palettes,
                change: function( event, ui ) {
                    if ( self.options.rgba ) {
                        self.toggler.css( { 'background-image': 'url(' + image + ')' } ).html('<span />');
                        self.toggler.find('span').css({
                            'width': '100%',
                            'height': '100%',
                            'position': 'absolute',
                            'top': 0,
                            'left': 0,
                            'border-top-left-radius': '3px',
                            'border-bottom-left-radius': '3px',
                            'background': ui.color.toString()
                        });
                    } else {
                        self.toggler.css( { backgroundColor: ui.color.toString() } );
                    }
                    // check for a custom cb
                    if ( $.isFunction( self.options.change ) ) {
                        self.options.change.call( this, event, ui );
                    }
                }
            } );

            el.val( self.initialValue );
            self._addListeners();
            if ( ! self.options.hide ) {
                self.toggler.click();
            }
        },

        _addListeners: function() {
            var self = this;

            // prevent any clicks inside this widget from leaking to the top and closing it
            self.wrap.on( 'click.wpcolorpicker', function( event ) {
                event.stopPropagation();
            });

            self.toggler.click( function(){
                if ( self.toggler.hasClass( 'wp-picker-open' ) ) {
                    self.close();
                } else {
                    self.open();
                }
            });

            self.element.change( function( event ) {
                var me = $( this ),
                    val = me.val();
                // Empty or Error = clear
                if ( val === '' || self.element.hasClass('iris-error') ) {
                    if ( self.options.rgba ) {
                        self.toggler.removeAttr('style');
                        self.toggler.find('span').css( 'backgroundColor', '' );
                    } else {
                        self.toggler.css( 'backgroundColor', '' );
                    }
                    // fire clear callback if we have one
                    if ( $.isFunction( self.options.clear ) ) {
                        self.options.clear.call( this, event );
                    }
                }
            });

            // open a keyboard-focused closed picker with space or enter
            self.toggler.on( 'keyup', function( event ) {
                if ( event.keyCode === 13 || event.keyCode === 32 ) {
                    event.preventDefault();
                    self.toggler.trigger( 'click' ).next().focus();
                }
            });

            self.button.click( function( event ) {
                var me = $( this );
                if ( me.hasClass( 'wp-picker-clear' ) ) {
                    self.element.val( '' );
                    if ( self.options.rgba ) {
                        self.toggler.removeAttr('style');
                        self.toggler.find('span').css( 'backgroundColor', '' );
                    } else {
                        self.toggler.css( 'backgroundColor', '' );
                    }
                    if ( $.isFunction( self.options.clear ) ) {
                        self.options.clear.call( this, event );
                    }
                } else if ( me.hasClass( 'wp-picker-default' ) ) {
                    self.element.val( self.options.defaultColor ).change();
                }
            });
        }
    });

    /**
     * Overwrite iris
     */
    $.widget( 'a8c.iris', $.a8c.iris, {
        _create: function() {
            this._super();

            // Global option for check is mode rbga is enabled
            this.options.rgba = this.element.data( 'rgba' ) || false;

            // Is not input disabled
            if ( ! this.element.is( ':input' ) ) {
                this.options.alpha = false;
            }

            if ( typeof this.options.rgba !== 'undefined' && this.options.rgba ) {
                var self = this,
                    el = self.element,
                    _html = '<div class="iris-strip iris-slider iris-alpha-slider"><div class="iris-slider-offset iris-slider-offset-alpha"></div></div>',
                    aContainer = $( _html ).appendTo( self.picker.find( '.iris-picker-inner' ) ),
                    aSlider = aContainer.find( '.iris-slider-offset-alpha' ),
                    controls = {
                        aContainer: aContainer,
                        aSlider: aSlider
                    };

                // Push new controls
                $.each( controls, function( k, v ){
                    self.controls[k] = v;
                });

                // Change size strip and add margin for sliders
                self.controls.square.css({'margin-right': '0'});
                var emptyWidth = ( self.picker.width() - self.controls.square.width() - 20 ),
                    stripsMargin = emptyWidth/6,
                    stripsWidth = (emptyWidth/2) - stripsMargin;

                $.each( [ 'aContainer', 'strip' ], function( k, v ) {
                    self.controls[v].width( stripsWidth ).css({ 'margin-left': stripsMargin + 'px' });
                });

                // Add new slider
                self._initControls();

                // For updated widget
                self._change();
            }
        },
        _initControls: function() {
            this._super();

            if ( this.options.rgba ) {
                var self = this,
                    controls = self.controls;

                controls.aSlider.slider({
                    orientation: 'vertical',
                    min: 0,
                    max: 100,
                    step: 1,
                    value: parseInt( self._color._alpha * 100 ),
                    slide: function( event, ui ) {
                        // Update alpha value
                        self._color._alpha = parseFloat( ui.value/100 );
                        self._change.apply( self, arguments );
                    }
                });
            }
        },
        _change: function() {
            this._super();
            var self = this,
                el = self.element;

            if ( this.options.rgba ) {
                var	controls = self.controls,
                    alpha = parseInt( self._color._alpha*100 ),
                    color = self._color.toRgb(),
                    gradient = [
                        'rgb(' + color.r + ',' + color.g + ',' + color.b + ') 0%',
                        'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 0) 100%'
                    ],
                    defaultWidth = self.options.defaultWidth,
                    customWidth = self.options.customWidth,
                    target = self.picker.closest('.wp-picker-container').find( '.wp-color-result' );

                // Generate background slider alpha, only for CSS3 old browser fuck!! :)
                controls.aContainer.css({ 'background': 'linear-gradient(to bottom, ' + gradient.join( ', ' ) + '), url(' + image + ')' });

                if ( target.hasClass('wp-picker-open') ) {
                    // Update alpha value
                    controls.aSlider.slider( 'value', alpha );

                    /**
                     * Disabled change opacity in default slider Saturation ( only is alpha enabled )
                     * and change input width for view all value
                     */
                    if ( self._color._alpha < 1 ) {
                        var style = controls.strip.attr( 'style' ).replace( /rgba\(([0-9]+,)(\s+)?([0-9]+,)(\s+)?([0-9]+)(,(\s+)?[0-9\.]+)\)/g, 'rgb($1$3$5)' );

                        controls.strip.attr( 'style', style );

                        el.width( parseInt( defaultWidth + customWidth ) );
                    } else {
                        el.width( defaultWidth );
                    }
                }
            }

            var reset = el.data('reset-alpha') || false;
            if ( reset ) {
                self.picker.find( '.iris-palette-container' ).on( 'click.palette', '.iris-palette', function() {
                    self._color._alpha = 1;
                    self.active = 'external';
                    self._change();
                });
            }
        },
        _addInputListeners: function( input ) {
            var self = this,
                debounceTimeout = 100,
                callback = function( event ){
                    var color = new Color( input.val() ),
                        val = input.val();

                    input.removeClass( 'iris-error' );
                    // we gave a bad color
                    if ( color.error ) {
                        // don't error on an empty input
                        if ( val !== '' ) {
                            input.addClass( 'iris-error' );
                        }
                    } else {
                        if ( color.toString() !== self._color.toString() ) {
                            // let's not do this on keyup for hex shortcodes
                            if ( ! ( event.type === 'keyup' && val.match( /^[0-9a-fA-F]{3}$/ ) ) ) {
                                self._setOption( 'color', color.toString() );
                            }
                        }
                    }
                };

            input.on( 'change', callback ).on( 'keyup', self._debounce( callback, debounceTimeout ) );

            // If we initialized hidden, show on first focus. The rest is up to you.
            if ( self.options.hide ) {
                input.one( 'focus', function() {
                    self.show();
                });
            }
        }
    } );

}( jQuery ) );

ColorPickerControl = AbstractControl.extend( {

    ui : {
        'input' : 'input'
    },

    events : {},

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );

        data.value = this.model.setting.get( 'value' );
        data.rgba = this.model.get( 'rgba' );

        return data;
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
    },

	/**
     * Initializes the WP ColorPicker jQuery widget.
     *
     * @since 1.0.0
     */
    onRender : function() {

        var control = this;

        this.ui.input.wpColorPicker( {
            palettes : this.model.get( 'palettes' ),
            defaultColor : control.getDefaultValue(),

            change : function() {
                control.setSettingValue( control.ui.input.wpColorPicker( 'color' ) );
            },

            clear : function() {
                control.setSettingValue( '' );
            }

        } );
    },

	/**
     * Ensures that the WP ColorPicker widget is closed when the control is destroyed.
     *
     * @since 1.0.0
     */
    onBeforeDestroy : function() {
        this.ui.input.wpColorPicker( 'close' );
    }

} );

module.exports = ColorPickerControl;
},{"./abstract-control":6}],11:[function(require,module,exports){
/**
 * Tailor.Controls.Editor
 *
 * An editor control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
	AbstractControl = require( './abstract-control' ),
	EditorControl;

EditorControl = AbstractControl.extend( {

    ui : {
        'input' : 'textarea',
        'default' : '.js-default'
    },

    getTemplate : function() {
        var html = document.getElementById( 'tmpl-tailor-control-editor' ).innerHTML;
        return _.template( html
                .replace( new RegExp( 'tailor-editor', 'gi' ), this.cid )
                .replace( new RegExp( 'tailor-value', 'gi' ), '<%= value %>' )
        );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.toggleDefaultButton );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
        this.listenTo( app.channel, 'list:change:order', this.maybeRefreshEditor );
    },

	/**
	 * Refreshes the editor after the containing list item is moved.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param el
	 */
	maybeRefreshEditor : function( el ) {
        if ( el.contains( this.el ) ) {
            tinyMCE.execCommand( 'mceRemoveEditor', false, this.cid );
            tinyMCE.execCommand( 'mceAddEditor', false, this.cid );
        }
    },

    /**
     * Initializes the TinyMCE instance.
     *
     * @since 1.0.0
     */
    onAttach : function() {
		var input = this.ui.input;
		var id = this.cid;
		var quickTagSettings = _.extend( {}, tinyMCEPreInit.qtInit['tailor-editor'], { id : id } );

		quicktags( quickTagSettings );
		QTags._buttonsInit();

		tinyMCEPreInit.mceInit[ id ] = _.extend( {}, tinyMCEPreInit.mceInit['tailor-editor'], {
			id : id,
			resize : 'vertical',
			height: 350,

			setup : function( ed ) {
                ed.on( 'change', function() {
                    ed.save();
                    input.change();
                } );
			}
		} );

		switchEditors.go( id, 'tmce' );

        tinymce.execCommand( 'mceAddEditor', true, id );
	},

    /**
     * Restores the default value for the setting.
     *
     * @since 1.0.0
     *
     * @param e
     */
    restoreDefaultValue : function( e ) {
        var value = this.getDefaultValue();

        this.setSettingValue( value );
        tinyMCE.get( this.cid ).setContent( value );
    },

    /**
     * Destroys the TinyMCE instance when the control is destroyed.
     *
     * @since 1.0.0
     */
	onDestroy : function() {
        tinyMCE.execCommand( 'mceRemoveEditor', true, this.cid );
	}

} );

module.exports = EditorControl;
},{"./abstract-control":6}],12:[function(require,module,exports){
/**
 * Tailor.Controls.Gallery
 *
 * A gallery control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    GalleryControl;

GalleryControl = AbstractControl.extend( {

	ui: {
        select : '.button--select',
        change : '.button--change',
		remove : '.button--remove',
        thumbnails : '.thumbnails',
        default : '.js-default'
	},

    events : {
        'click @ui.select' : 'selectImages',
        'click @ui.change' : 'selectImages',
        'click @ui.thumbnails' : 'selectImages',
        'click @ui.remove' : 'removeImages',
        'click @ui.default' : 'restoreDefaultValue'
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
        data.showDefault = null != defaultValue && data.value != defaultValue;
        data.ids = this.ids();

        return data;
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
	 * Opens the Media Library window.
	 *
	 * @since 1.0.0
	 */
    selectImages : function() {
        var galleryControl = this;
        var ids = this.ids();
		var selection = this.getSelection( ids );
        var frame = wp.media( {
            frame : 'post',
            state : ( ids.length ? 'gallery-edit' : 'gallery-library' ),
            editing : true,
            multiple : true,
            selection : selection
        } );
		var library;

        frame
            .on( 'open', function() {

	            // Hide the Cancel Gallery link
                var mediaFrame = frame.views.get( '.media-frame-menu' )[0];
                mediaFrame.$el.children().slice( 0, 2 ).hide();

	            library = JSON.stringify( selection.toJSON() );
            } )
            .on( 'update', function( collection ) {
	            var value = collection.pluck( 'id' ).join( ',' );
	            galleryControl.setSettingValue( value );

	            if ( ! _.isEqual( library, JSON.stringify( collection.toJSON() ) ) ) {
		            galleryControl.model.setting.trigger( 'change', galleryControl.model.setting, value );
	            }
	            galleryControl.updateThumbnails( collection );

            } )
            .on( 'close', function() {
                frame.dispose();
            } );

        frame.open();
    },

	/**
	 * Removes all selected images.
	 *
	 * @since 1.0.0
	 */
    removeImages : function() {
        this.setSettingValue( '' );
        this.render();
    },

	/**
	 * Updates the thumbnails when the control is rendered.
	 *
	 * @since 1.0.0
	 */
    onRender : function() {
        this.generateThumbnails();
    },

	/**
	 * Generates image thumbnails.
	 *
	 * @since 1.0.0
	 */
	generateThumbnails : function() {
		var gallery = this;
		var ids = this.ids();

		if ( ids.length ) {
			var selection = this.getSelection( this.ids() );

			selection.more().done( function() {
				selection.props.set( { query: false } );
				selection.unmirror();
				selection.props.unset( 'orderby' );

				gallery.updateThumbnails( selection );
			} );
		}
	},

	/**
	 * Updates image thumbnails based on a selection from the Media Library.
	 *
	 * @since 1.0.0
	 *
	 * @param selection
	 */
	updateThumbnails : function( selection ) {
		var html = '';
		var urls = selection.map( function( attachment ) {

			var sizes = attachment.get( 'sizes' );
			var url;

			if ( sizes.hasOwnProperty( 'medium' ) ) {
				url = sizes.medium.url;
			}
			else if ( sizes.hasOwnProperty( 'thumbnail' ) ) {
				url = sizes.thumbnail.url;
			}
			else if ( sizes.hasOwnProperty( 'full' ) ) {
				url = sizes.full.url;
			}
			else {
				url = '';
			}

			return url;
		} );

		if ( urls.length ) {
			_.each( urls, function( url ) {
				html += '<li class="thumbnail"><img src="' + url + '"/></li>';
			} );
		}

		this.ui.thumbnails
			.removeClass( 'is-loading' )
			.html( html );
	},

	/**
	 * Returns a Media Library selection from a given set of image ids.
	 *
	 * @since 1.0.0
	 *
	 * @param ids
	 * @returns {*|R|r}
	 */
    getSelection : function( ids ) {
        var attachments = wp.media.query( {
            orderby : 'post__in',
            order: 'ASC',
            type: 'image',
            post__in : ids
        } );

        return new wp.media.model.Selection( attachments.models, {
            props : attachments.props.toJSON(),
            multiple: true
        } );
    },
	
    /**
     * Returns the selected image IDs.
     *
     * @since 1.0.0
     *
     * @returns {Array|*}
     */
    ids : function() {
        var value = this.getSettingValue();
        return value ? value.split( ',' ) : false;
    },

    /**
     * Restores the default value for the setting.
     *
     * @since 1.0.0
     */
    restoreDefaultValue : function() {
        this.setSettingValue( this.getDefaultValue() );
    }

} );

module.exports = GalleryControl;
},{"./abstract-control":6}],13:[function(require,module,exports){
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
},{"./abstract-control":6}],14:[function(require,module,exports){
/**
 * Tailor.Controls.Image
 *
 * An image control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    ImageControl;

ImageControl = AbstractControl.extend( {

	ui : {
        'select' : '.button--select',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'default' : '.js-default',
        'thumbnails' : '.thumbnails',
        'thumbnail' : '.thumbnail'
    },

    events : {
        'click @ui.select' : 'openFrame',
        'click @ui.change' : 'openFrame',
        'click @ui.remove' : 'removeImage',
        'click @ui.thumbnail' : 'openFrame',
        'click @ui.default' : 'restoreDefaultValue'
    },

    /**
     * Initializes the media frame for the control.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {

        this.frame = wp.media( {
            states: [
                new wp.media.controller.Library({
                    title : 'Select Image',
                    library : wp.media.query( { type : [ 'image' ] } ),
                    multiple : false,
                    date : false
                } )
            ]
        } );

        this.addEventListeners();
        this.checkDependencies( this.model.setting );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.render );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
        //this.listenTo( this.frame, 'select', this.selectImage );

        this.frame.on( 'select', this.selectImage.bind( this ) );
    },

    /**
     * Opens the media frame.
     *
     * @since 1.0.0
     */
    openFrame : function() {
        this.frame.open();
    },

    /**
     * Saves the image ID and updates the thumbnail when the selected image changes.
     *
     * @since 1.0.0
     */
    selectImage : function() {
        var selection = this.frame.state().get( 'selection' );
        var attachment = selection.first();
        var sizes = attachment.get( 'sizes' );

        this.setSettingValue( attachment.get( 'id' ) );
        this.updateThumbnail( sizes );
    },

    /**
     * Updates the image thumbnail.
     *
     * @since 1.0.0
     *
     * @param sizes
     */
    updateThumbnail : function( sizes ) {
        var url;
        if ( sizes.hasOwnProperty( 'medium' ) ) {
            url = sizes.medium.url;
        }
        else if ( sizes.hasOwnProperty( 'thumbnail' ) ) {
            url = sizes.thumbnail.url;
        }
        else if ( sizes.hasOwnProperty( 'full' ) ) {
            url = sizes.full.url; // small images do not have thumbnail generated
        }
        else {
            return; // invalid sizes
        }
        
        this.ui.thumbnails
            .removeClass( 'is-loading' )
            .html( '<li class="thumbnail"><img src="' + url + '"/></li>' );
    },

    /**
     * Removes the selected image.
     *
     * @since 1.0.0
     */
    removeImage : function() {
        this.setSettingValue( '' );
    },

    /**
     * Renders the image thumbnail.
     *
     * @since 1.0.0
     */
    onRender : function() {

        var control = this;
        var id = this.getSettingValue();

        if ( id ) {
            var attachment = wp.media.attachment( id );
            var sizes = attachment.get( 'sizes' );

            if ( sizes ) {
                this.updateThumbnail( sizes );
            }
            else {
                attachment.fetch( {
                    success : function() {
                        sizes = attachment.get( 'sizes' );
                        control.updateThumbnail( sizes );
                    }
                } );
            }
        }
    },

    /**
     * Disposes of the media frame when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.frame.off().dispose();
    }

} );

module.exports = ImageControl;
},{"./abstract-control":6}],15:[function(require,module,exports){
/**
 * Tailor.Controls.Link
 *
 * A link control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    LinkControl;

LinkControl = AbstractControl.extend( {

	ui: {
        'input' : 'input',
        'select' : '.button--select',
        'default' : '.js-default'
	},

    events : {
        'input @ui.input' : 'onControlChange',
        'change @ui.input' : 'onControlChange',
        'click @ui.select' : 'openDialog',
        'click @ui.default' : 'restoreDefaultValue'
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
        data.placeholder = this.model.get( 'placeholder' );
        data.showDefault = null != defaultValue && data.value != defaultValue;

        return data;
    },

	/**
     * Queries the server for links based on the search criteria.
     *
     * @since 1.0.0
     *
     * @param term
     */
    search : function( term ) {
        var control = this;
        var $searchResults = this.$el.find( '.search-results' );

        if ( $searchResults.length ) {

            control.$el.addClass( 'is-searching' );

            var options = {
	            
                data : {
                    s : term,
                    nonce : window._nonces.query
                },

	            /**
	             * Appends the list of search results to the page.
	             *
	             * @since 1.0.0
	             */
                success : function( response ) {
                    $searchResults.html( response );
                },

	            error: function( response ) {
		            console.log( arguments );
	            },

	            /**
	             * Resets the control classname when searching is complete.
	             */
                complete : function() {
                    control.$el.removeClass( 'is-searching' );
                }
            };

            window.ajax.send( 'tailor_get_links', options );
        }
    },

	/**
     * Opens the link selection dialog.
     *
     * @since 1.0.0
     */
    openDialog : function() {
        var control = this;
        var options = {
            title : 'Select content',
            button : window._l10n.select,

	        /**
	         * Returns the content for the Select Content dialog.
	         *
	         * @since 1.0.0
	         *
	         * @returns {*}
	         */
            content : function() {
                return  '<div class="dialog__container">' +
                            '<input class="search--content" type="search" role="search" placeholder="Search">' +
                            '<span class="spinner"></span>' +
                            '<div class="search-results"></div>' +
                        '</div>';
            },

	        /**
	         * Adds the required event listeners to the dialog window content.
	         *
	         * @since 1.0.0
	         */
            onOpen : function() {
                var dialog = this;
                var previousTerm = '';
                var minimumCharacters = 3;
                var timeout;

                this.$el.find( '.search--content' ).on( 'input', function( e ) {

                    clearTimeout( timeout );

                    var term = this.value;
                    if ( term.length >= minimumCharacters && previousTerm != $.trim( term ) ) {
                        timeout = setTimeout( $.proxy( control.search, dialog, term ), 500 );
                    }
                } );
            },

	        /**
	         * Returns true if an item has been selected.
	         *
	         * @since 1.0.0
	         *
	         * @returns {*}
	         */
            onValidate : function() {
                return $( 'input[name=url]:checked' ).val()
            },

	        /**
	         * Updates the setting value with the selected item URL.
	         *
	         * @since 1.0.0
	         */
            onSave : function() {
                var url = $( 'input[name=url]:checked' ).val();

                control.setSettingValue( url );
                control.ui.input.val( url )
            },

	        /**
	         * Cleans up event listeners.
	         *
	         * @since 1.0.0
	         */
            onClose : function() {
                this.$el.find( '.search--content' ).off( 'input' );
            }
        };

		/**
		 * Fires when the dialog window is opened.
		 *
		 * @since 1.0.0
		 */
		app.channel.trigger( 'dialog:open', options );
    },

	/**
     * Clears the selected icon.
     *
     * @since 1.0.0
     */
    removeIcon : function() {
        this.setSettingValue( '' );
    },

	/**
     * Re-renders the control when the default value is restored.
     *
     * @since 1.0.0
     */
    onRestoreDefault : function() {
        this.render();
    }

} );

module.exports = LinkControl;
},{"./abstract-control":6}],16:[function(require,module,exports){
/**
 * The empty-list view.
 *
 * @since 1.0.0
 */

module.exports = Marionette.ItemView.extend( {

    template : '#tmpl-tailor-control-list-empty'

} );
},{}],17:[function(require,module,exports){
/**
 * Individual list item view.
 *
 * @augments Marionette.CompositeView
 */
var $ = Backbone.$,
	ListItemControl;

ListItemControl = Marionette.CompositeView.extend( {

    tagName : 'li',

    className : 'list-item',

    ui : {
        title : '.list-item__title',
        content : '.list-item__content',
        delete : '.js-delete-list-item',
        close : '.js-close-list-item'
    },

    triggers : {
        'click @ui.title' : 'toggle',
        'click @ui.close' : 'toggle',
        'click @ui.delete' : 'delete'
    },

    events : {
        'keypress' : 'onKeyPress'
    },

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView: function( child ) {
        return window.Tailor.Controls.lookup( child.get( 'type' ) );
    },

    childViewContainer : '#controls',

    template : '#tmpl-tailor-control-list-item',

	/**
	 * Initializes the list item view.
	 *
	 * @since 1.0.0
	 *
	 * @param options
	 */
    initialize : function( options ) {
        this.settings = options.settings;
        this._open = false;
        this.model.startTracking();

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.settings, 'change', this.onChangeSettings );
        this.listenTo( app.channel, 'modal:apply', this.onApplyModal );
        this.listenTo( app.channel, 'modal:close', this.onCloseModal );
    },

	/**
	 * Updates the list item title.
	 *
	 * @since 1.0.0
	 *
	 * @param from
	 * @param to
	 */
    updateTitle : function( from, to ) {
        this.ui.title.find( ':contains(' + from + ')' ).html( to );
    },

	/**
	 * Toggles the list item when selected using the keyboard.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.triggerMethod( 'toggle' );
        }
    },

	/**
	 * Toggles the list item.
	 *
	 * @since 1.0.0
	 */
    onToggle : function() {
        if ( this._open ) {
            this.slideUp();
        }
        else {
            this.slideDown();
        }
    },

	/**
	 * Hides the list item.
	 *
	 * @since 1.0.0
	 */
    slideUp : function() {
        var control = this;
        control._open = false;

        control.ui.content.slideUp( 150, function() {
            control.el.classList.remove( 'is-open' );
        } );
    },

	/**
	 * Shows the list item.
	 *
	 * @since 1.0.0
	 */
    slideDown : function() {
        var control = this;
        control._open = true;

        control.ui.content.slideDown( 150, function() {
            control.el.classList.add( 'is-open' );
        } );
    },

	/**
	 * Triggers the 'remove' method/event on the list item when removed.
	 *
	 * @since 1.0.0
	 */
    onDelete : function() {
        var control = this;
        control.$el.slideUp( 250, function() {

            /**
             * Destroys the list item view.
             *
             * @since 1.0.0
             */
            control.triggerMethod( 'remove' );
        } );
    },

	/**
	 * Updates the model and view when changes are made.
	 *
	 * @since 1.0.0
	 *
	 * @param setting
	 */
    onChangeSettings : function( setting ) {
        var atts = _.clone( this.model.get( 'atts' ) );
        var settingId = setting.get( 'id' );
        var settingValue = setting.get( 'value' );

        if ( 'title' == settingId ) {
            this.updateTitle( atts.title, settingValue );
        }

        atts[ settingId ] = settingValue;

        this.model.set( 'atts', atts );
    },

	/**
	 * Stops tracking changes when changes are applied.
	 *
	 * @since 1.0.0
	 */
    onApplyModal : function() {
        this.model.stopTracking();
    },

	/**
	 * Reset attributes to their original values when changes are discarded.
	 *
	 * @since 1.0.0
	 */
    onCloseModal : function() {
        this.model.resetAttributes();
    }


} );

module.exports = ListItemControl;
},{}],18:[function(require,module,exports){
/**
 * Tailor.Controls.List
 *
 * A list control.
 *
 * @augments Marionette.CompositeView
 */
var $ = Backbone.$,
    ListControl;

ListControl = Marionette.CompositeView.extend( {

    childView : require( './list-item' ),

    childViewContainer : '#list-items',

    emptyView : require( './list-empty' ),

    className : function() {
        return 'control control--' + this.model.get( 'type' );
    },

    ui : {
        'button' : '.js-add'
    },

    events : {
        'click @ui.button' : 'addItem'
    },

    collectionEvents : {
        'add' : 'updateContent',
        'remove' : 'updateContent',
        'change' : 'updateContent'
    },

    childEvents : {
        'remove' : 'deleteItem',
        'toggle' : 'onToggleItem'
    },

    template : '#tmpl-tailor-control-list',

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.childLabel = this.child.get( 'label' ).toLowerCase();
        return data;
    },

    /**
     * Returns the appropriate set of options for the child view.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     * @returns {{model: *}}
     */
    childViewOptions : function( model, index ) {
        var controlCollection = app.channel.request( 'sidebar:controls', model );
        var settingCollection = app.channel.request( 'sidebar:settings', model );
        var options = {
            model : model,
            collection : controlCollection,
            settings : settingCollection
        };

        return options;
    },

    /**
     * Initializes the list.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.element = options.element;
        this._added = [];
        this._deleted = [];

        var listLibraryItem = app.channel.request( 'sidebar:library', this.element.get( 'tag' ) );
        this.child = app.channel.request( 'sidebar:library', listLibraryItem.get( 'child' ) );

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'modal:apply', this.onApplyModal );
        this.listenTo( app.channel, 'modal:close', this.onCloseModal );
    },

    /**
     * Filters the element collection so that only children of this element are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return child.get( 'parent' ) == this.element.get( 'id' );
    },

    /**
     * Enables sorting of the list items.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var listControl = this;

        this.sortable = Sortable.create( this.$childViewContainer.get(0), {
            draggable : '.list-item',
            handle : '.list-item__title',
            animation : 250,

            /**
             * Updates the order of the list items when they are sorted.
             *
             * @since 1.0.0
             */
            onEnd : function ( e ) {

                /**
                 * Fires when a list item is reordered.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'list:change:order', listControl.el );

                listControl.updateOrder();
            }
        } );
    },

    /**
     * Returns true if the collection is empty (i.e., the list has no list items).
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    isEmpty : function() {
        return this.collection.getChildren( this.element ).length == 0;
    },

	/**
	 * Toggle a list item.
	 *
	 * @since 1.0.0
	 *
	 * @param child
	 */
	onToggleItem : function( child ) {
		this.children.each( function( childView ) {
			if ( childView !== child ) {
				childView.slideUp();
			}
		}, this );
	},

    /**
     * Slides up other list items when a list item is added.
     *
     * @since 1.0.0
     *
     * @param child
     */
    onAddChild : function( child ) {
        this.children.each( function( childView ) {
            if ( childView !== child ) {
                childView.slideUp();
            }
        }, this );
    },

    /**
     * Adds a list item.
     *
     * New list items are tracked so that they can be added, if necessary, when the modal window is closed.
     *
     * @since 1.0.0
     */
    addItem : function() {
        var numberChildren = this.collection.getChildren( this.element ).length;
        var item = _.first( this.collection.create( [ {
            tag : this.child.get( 'tag' ),
            parent : this.element.get( 'id' ),
            order : numberChildren,
            atts : {
                title : this.child.get( 'label' )
            }
        } ], { } ) );

        this._added.push( item );
    },

    /**
     * Deletes a list item.
     *
     * Preexisting list items are tracked so that they can be deleted, if necessary, when the modal window is closed.
     *
     * @since 1.0.0
     */
    deleteItem : function( view ) {

        // Delete the list item from the 'added' list, if it exists
        for ( var i = 0; i < this._added.length; i++ ) {
            if ( this._added[ i ] ==  view.model ) {
                this._added.splice( i, 1 );
            }
        }

        this.collection.remove( view.model );
        this._deleted.push( view.model );
    },

    /**
     * Resets the added and deleted list items.
     */
    onApplyModal : function() {
        this._deleted = [];
        this._added = [];
    },

    /**
     * Updates the collection to undo any unapplied changes to the collection.
     *
     * @since 1.0.0
     */
    onCloseModal : function() {
        this.collection.add( this._deleted );
        this.collection.remove( this._added );
    },

    /**
     * Updates the order of each list item after sorting.
     *
     * @since 1.0.0
     */
    updateOrder : function() {
        this.children.each( function( view ) {
            view.model.set( 'order', view.$el.index() );
        }, this );

	    this.collection.sort( { silent : true } );

	    this.updateContent();
    },

    /**
     * Updates the content attribute of the list when a list item changes.
     *
     * @since 1.0.0
     */
    updateContent : function() {
	    var shortcode = this.generateShortcode();
        this.model.setting.set( 'value', shortcode );
    },

    /**
     * Generates the content attribute of the list (i.e., a shortcode representing the list items).
     *
     * @since 1.0.0
     */
    generateShortcode : function() {
        var obj = this;
        var content = '';
        var parentId = this.element.get( 'id' );
        var children = this.collection.filter( function( model ) {
            return  model.get( 'parent' ) === parentId && ! obj._deleted.hasOwnProperty( model.cid );
        } );

        _.each( children, function( child ) {
            content += child.toShortcode();
        } );

        return content;
    },

	/**
	 * Cleans up the Sortable instance when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onBeforeDestroy : function() {
        this.sortable.destroy();
        this.collection.sort();
    }

} );

module.exports = ListControl;
},{"./list-empty":16,"./list-item":17}],19:[function(require,module,exports){
/**
 * Tailor.Controls.Radio
 *
 * A radio control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    RadioControl;

RadioControl = AbstractControl.extend( {

    ui : {
        'input' : 'input',
        'default' : '.js-default'
    },

    templateHelpers : {

        /**
         * Returns "checked" if the current choice is the selected one.
         *
         * @since 1.0.0
         *
         * @param choice
         * @returns {string}
         */
        checked : function( choice ) {
            return ( this.value === choice ) ? 'checked' : '';
        }
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
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        this.setSettingValue( this.ui.input.filter( ':checked' ).val() );
    }

} );

module.exports = RadioControl;
},{"./abstract-control":6}],20:[function(require,module,exports){
/**
 * Tailor.Controls.Range
 *
 * A range control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    RangeControl;

RangeControl = AbstractControl.extend( {

	ui : {
        'range' : 'input[type=range]',
		'input' : 'input[type=text]',
        'default' : '.js-default'
	},

    events : {
        'input @ui.range' : 'onControlChange',
        'change @ui.input' : 'onControlChange',
        'click @ui.default' : 'restoreDefaultValue'
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        var value = e.target.value;
        this.ui.input.val( value );
        this.ui.range.val( value );

        this.setSettingValue( value );
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
        this.render();
    }

} );

module.exports = RangeControl;
},{"./abstract-control":6}],21:[function(require,module,exports){
/**
 * Tailor.Controls.SelectMulti
 *
 * A select control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    SelectMultiControl;

SelectMultiControl = AbstractControl.extend( {


    ui : {
        'input' : 'select',
        'default' : '.js-default'
    },

    templateHelpers : {

        /**
         * Returns "selected" if the current choice is the selected one.
         *
         * @since 1.0.0
         *
         * @param choice
         * @returns {string}
         */
        selected : function( choice ) {
            var value = this.value.split( ',' );
            return -1 !== value.indexOf( choice ) ? 'selected' : '';
        }
    },

    /**
     * Initializes the Select2 plugin.
     *
     * @since 1.0.0
     */
    onRender : function() {
        this.ui.input.select2();
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        var select = this.ui.input.get(0);
        var value = [];

        for ( var i = 0; i < select.length; i ++ ) {
            if ( select[ i ].selected ) {
                value.push( select[ i ].value );
            }
        }

        this.setSettingValue( value.join( ',' ) );
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
        this.render();
    },

    /**
     * Destroys the Select2 instance when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.ui.input.select2( 'destroy' );
    }

} );

module.exports = SelectMultiControl;
},{"./abstract-control":6}],22:[function(require,module,exports){
/**
 * Tailor.Controls.Select
 *
 * A select control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    SelectControl;

SelectControl = AbstractControl.extend( {

    ui : {
        'input' : 'select',
        'default' : '.js-default'
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.render );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
    }

} );

module.exports = SelectControl;

},{"./abstract-control":6}],23:[function(require,module,exports){
/**
 * Tailor.Controls.Style
 *
 * A style control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    StyleControl;

StyleControl = AbstractControl.extend( {

    ui : {
        'input' : 'input',
        'default' : '.js-default'
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
        data.choices = [];

        var values = data.value.split( '-' );
        var choices = this.model.get( 'choices' );
        for ( var choice in choices ) {
            if ( choices.hasOwnProperty( choice ) ) {
                data.choices[ choices[ choice ] ] = values.shift() || '';
            }
        }

        return data;
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {

        var values = [];

        _.each( this.ui.input, function( input, index ) {
            values.push( input.value );
        }, this );

        this.setSettingValue( values.join( '-' ) );
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
        this.render();
    }

} );

module.exports = StyleControl;
},{"./abstract-control":6}],24:[function(require,module,exports){
/**
 * Tailor.Controls.Switch
 *
 * A switch control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    SwitchControl;

SwitchControl = AbstractControl.extend( {

    ui : {
        'input' : 'input',
        'default' : '.js-default'
    },

    templateHelpers : {

        /**
         * Returns true if the switch is enabled.
         *
         * @since 1.0.0
         *
         * @returns {string}
         */
        checked : function() {
            return ! this.value ? '' : 'checked';
        }
    },

    /**
     * Responds to a control change.
     *
     * @since 1.0.0
     */
    onControlChange : function( e ) {
        this.setSettingValue( this.ui.input.get(0).checked ? 1 : '' );
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
        this.render();
    }

} );

module.exports = SwitchControl;
},{"./abstract-control":6}],25:[function(require,module,exports){
/**
 * Tailor.Controls.Text
 *
 * A text control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    TextControl;

TextControl = AbstractControl.extend( {

    ui : {
		'input' : 'input',
		'default' : '.js-default'
	},

    templateHelpers : {

        /**
         * Returns the attributes for the control.
         *
         * @since 1.0.0
         *
         * @returns {string}
         */
        inputAttrs : function() {
            var atts = '';
            _.each( this.attrs, function( value, attr ) {
                atts += ( attr + '="' + value + '"' );
            } );
            return atts;
        }
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

        data.attrs = this.model.get( 'input_attrs' );

        return data;
    },

    onRestoreDefault : function() {
        this.render();
    }

} );

module.exports = TextControl;
},{"./abstract-control":6}],26:[function(require,module,exports){
/**
 * Tailor.Controls.Textarea
 *
 * A textarea control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    TextareaControl;

TextareaControl = AbstractControl.extend( {

    ui : {
        'input' : 'textarea',
        'default' : '.js-default'
    },

    onRestoreDefault : function() {
        this.render();
    }

} );

module.exports = TextareaControl;
},{"./abstract-control":6}],27:[function(require,module,exports){
/**
 * Tailor.Controls.Video
 *
 * A video control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    VideoControl;

VideoControl = AbstractControl.extend( {

	ui : {
        'select' : '.button--select',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'default' : '.js-default',
        'preview' : '.video-preview'
	},

    events : {
        'click @ui.select' : 'openFrame',
        'click @ui.change' : 'openFrame',
        'click @ui.remove' : 'removeVideo',
        'click @ui.default' : 'restoreDefaultValue'
    },

    /**
     * Initializes the media frame for the control.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {

        this.frame = wp.media( {
            states: [
                new wp.media.controller.Library({
                    title : 'Select Video',
                    library : wp.media.query( { type : [ 'video' ] } ),
                    multiple : false,
                    date : false
                } )
            ]
        } );

        this.addEventListeners();
        this.checkDependencies( this.model.setting );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.render );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
        this.listenTo( this.frame, 'select', this.selectVideo );
    },

    /**
     * Opens the media frame.
     *
     * @since 1.0.0
     */
    openFrame : function() {
        this.frame.open();
    },

    /**
     * Saves the image ID and updates the thumbnail when the selected image changes.
     *
     * @since 1.0.0
     */
    selectVideo : function() {
        var selection = this.frame.state().get( 'selection' );
        var attachment = selection.first();

        this.setSettingValue( attachment.get( 'id' ) );
        this.updatePreview( attachment );
    },

    /**
     * Updates the video preview.
     *
     * @since 1.0.0
     *
     * @param attachment
     */
    updatePreview : function( attachment ) {
        var url = attachment.get( 'url' );
        var mime = attachment.get( 'mime' );

        this.ui.preview
            .removeClass( 'is-loading' )
            .html( '<video controls><source src="' + url + '" type="' + mime + '"></video>' );
    },

    /**
     * Removes the selected video.
     *
     * @since 1.0.0
     */
    removeVideo : function() {
        this.setSettingValue( '' );
    },

    /**
     * Renders the image thumbnail.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var control = this;
        var id = this.getSettingValue();

        if ( id ) {
            var attachment = wp.media.attachment( id );
            if ( ! attachment.get( 'url' ) ) {
                attachment.fetch( {
                    success : function() {
                        control.updatePreview( attachment );
                    }
                } );
            }
            else {
                control.updatePreview( attachment );
            }
        }
    },

    /**
     * Disposes of the media frame when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.frame.dispose();
        //this.destroyPlayer();
    },

    /**
     * Initializes the video player.
     *
     * @since 1.0.0
     */
    initializePlayer : function() {
        var mejsSettings = window._wpmejsSettings || {};
        var video = this.ui.preview.get(0).firstChild;
        this.player = new MediaElementPlayer( video, mejsSettings );
    },

    /**
     * Destroys the video player.
     *
     * @since 1.0.0
     */
    destroyPlayer : function() {
        this.player && wp.media.mixin.removePlayer( this.player );
    }

} );

module.exports = VideoControl;
},{"./abstract-control":6}],28:[function(require,module,exports){
/**
 * Tailor.Items.Default
 *
 * A default list item.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    DefaultItem;

DefaultItem = Marionette.ItemView.extend( {

    events : {
        click : 'onClick',
        keypress : 'onKeyPress'
    },

    modelEvents : {
        'focus' : 'onFocus'
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    template : '#tmpl-tailor-panel-default-item',

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );
        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

	/**
	 * Displays the associated section when the item is clicked.
	 *
	 * @since 1.0.0
	 */
    onClick : function() {
        this.triggerMethod( 'show:section' );
    },

	/**
	 * Displays the associated section when the item is selected using the keyboard.
	 *
	 * @since 1.0.0
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.triggerMethod( 'show:section' );
        }
    },

	/**
	 * Sets focus on the list item.
	 *
	 * @since 1.0.0
	 */
	onFocus : function() {
		this.el.focus();
	}

} );

module.exports = DefaultItem;
},{}],29:[function(require,module,exports){
/**
 * Tailor.Items.History
 *
 * A list item for the History panel.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    HistoryItem;

HistoryItem = Marionette.ItemView.extend( {

    events : {
        click : 'restore',
        keypress : 'onKeyPress'
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    template : '#tmpl-tailor-panel-history-item',

    /**
     * Initializes the item.
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
        this.listenTo( this.model.collection, 'change:active', this.toggleClass );
    },

	/**
	 * Assigns the appropriate class name to the item based on whether it is active.
	 *
	 * @since 1.0.0
	 */
    onRender : function() {
        this.toggleClass();
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

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

	/**
	 * Restores the associated history entry when the item is selected using the keyboard.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.restore();
        }
    },

    /**
     * Restores the history entry.
     *
     * @since 1.0.0
     */
    restore : function() {
        var timestamp = this.model.get( 'timestamp' );

	    /**
	     * Fires before a request is made to restore a given history entry.
	     *
	     * @since 1.0.0
	     *
	     * @param id
	     */
	    app.channel.trigger( 'before:history:restore', timestamp );

        /**
         * Fires after a request is made to restore a given history entry.
         *
         * @since 1.0.0
         *
         * @param id
         */
        app.channel.trigger( 'history:restore', timestamp );
    },

    /**
     * Toggles the state of the entry element based on its status.
     *
     * @since 1.0.0
     *
     * @param model
     */
    toggleClass : function( model ) {
        model = model || this.model.collection.getActive();
        this.$el.toggleClass( 'is-active', model === this.model );
    }

} );

module.exports = HistoryItem;
},{}],30:[function(require,module,exports){
/**
 * Tailor.Items.Library
 *
 * A list item for the Library panel.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    LibraryItem;

LibraryItem = Marionette.ItemView.extend( {

    events : {
        click : 'onClick',
        keypress : 'onKeyPress'
    },

    modelEvents : {
        'change:match' : 'onSearch'
    },

    behaviors : {
        Draggable : {}
    },

    onClick : function() {
        var el = this.el;

        if ( el.classList.contains( 'is-inactive') ) {
            return;
        }

        var onAnimationEnd = function( e ) {
            el.removeEventListener( window.animationEndName, onAnimationEnd );
            el.classList.remove( 'shake' );
        };

        if ( Modernizr.cssanimations ) {
            el.addEventListener( window.animationEndName, onAnimationEnd );
            el.classList.add( 'shake' );
        }

        Tailor.Notify( window._l10n.dragElement, 'warning' );
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-panel-library-item';
    },

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );

        return this;
    },

	/**
     * Shows or hides the item based on whether it matches search criteria.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSearch : function( model ) {
        this.el.style.display = ! model.get( 'match' ) ? 'none' : 'block';
    }

} );

module.exports = LibraryItem;
},{}],31:[function(require,module,exports){
/**
 * Tailor.Items.Panels
 *
 * A list item for the list of panels (Home).
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
	PanelItem;

PanelItem = Marionette.ItemView.extend( {

    events : {
        click : 'onClick',
        keypress : 'onKeyPress'
    },

    modelEvents : {
        focus : 'onFocus'
    },

    template : '#tmpl-tailor-panel-default-item',

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

	/**
	 * Displays the associated panel when the item is clicked.
	 *
	 * @since 1.0.0
	 */
    onClick : function() {
        this.triggerMethod( 'show:panel' );
    },

	/**
	 * Displays the associated panel when the item is selected using the keyboard.
	 *
	 * @since 1.0.0
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.triggerMethod( 'show:panel' );
        }
    },

	/**
	 * Sets focus on the list item.
	 *
	 * @since 1.0.0
	 */
    onFocus : function() {
        this.el.focus();
    }

} );

module.exports = PanelItem;
},{}],32:[function(require,module,exports){
/**
 * Tailor.Items.Templates
 *
 * A list item for the Templates panel.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    TemplateItem;

TemplateItem = Marionette.ItemView.extend( {

    ui : {
        'delete' : '.js-delete-template',
        'download' : '.js-download-template',
        'preview' : '.js-preview-template'
    },

    events : {
        //'click @ui.download' : 'download',
        //'click @ui.delete' : 'delete',
        //'click @ui.preview' : 'preview',
        'click' : 'onClick'
    },

    modelEvents : {
        'change:match' : 'onSearch'
    },

    behaviors : {
        Draggable : {}
    },

    onClick : function( e ) {

        switch ( e.target ) {

            case this.ui.download.get( 0 ):
                this.download();
                break;

            case this.ui.delete.get( 0 ):
                this.delete();
                break;

            case this.ui.preview.get( 0 ):
                this.preview();
                break;

            default:
                var el = this.el;
                var onAnimationEnd = function( e ) {
                    el.removeEventListener( window.animationEndName, onAnimationEnd );
                    el.classList.remove( 'shake' );
                };

                if ( Modernizr.cssanimations ) {
                    el.addEventListener( window.animationEndName, onAnimationEnd );
                    el.classList.add( 'shake' );
                }

                Tailor.Notify( window._l10n.dragTemplate, 'warning' );
        }
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-panel-templates-item';
    },

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

    /**
     * Downloads the template to a JSON file.
     *
     * @since 1.0.0
     */
    download : function() {
        var item = this;
        var id = item.model.get( 'id' );

        var options = {

            data : {
                template_id : id,
                nonce : window._nonces.loadTemplate
            },

            success : function( response ) {
                var model = item.model;
                var models = response.models;
                var label = model.get( 'label' );

                id = label.replace( ' ', '-' ).toLowerCase();

                var json = {
                    id : id,
                    label : label,
                    tag : model.get( 'tag' ),
                    type : model.get( 'type' ),
                    models : models
                };

                json = "data:text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( json ) );

                var a = document.getElementById( 'download-template' );
                a.setAttribute( 'href', json );
                a.setAttribute( 'download', 'tailor-template-' + id + '-' + Date.now() + '.json' );
                a.click();
            }
        };

        window.ajax.send( 'tailor_load_template', options );
    },

    /**
     * Deletes the template.
     *
     * @since 1.0.0
     */
    delete : function() {
        var that = this;
        var options = {
            data : {
                id : that.model.get( 'id' ),
                nonce : window._nonces.deleteTemplate
            },

	        /**
             * Destroys the template list item when the template is successfully deleted.
             *
             * @since 1.0.0
             *
             * @param response
             */
            success : function( response ) {
                that.$el.slideUp( function() {
                    that.model.trigger( 'destroy', that.model );
                } );

                /**
                 * Fires when a template is deleted.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'template:delete' );
            }
        };

        window.ajax.send( 'tailor_delete_template', options );
    },

    /**
     * Previews the template.
     *
     * @since 1.0.0
     */
    preview : function() {
        window.open( window._urls.view + '?template_preview=1&template_id=' + this.model.get( 'id' ), '_blank' );
    },


    /**
     * Determines whether the template should be visible based on search terms entered in the template search bar.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSearch : function( model ) {
        this.el.style.display = ! model.get( 'match' ) ? 'none' : 'block';
    }

} );

module.exports = TemplateItem;
},{}],33:[function(require,module,exports){
/**
 * Tailor.Panels.Default
 *
 * A default panel.
 *
 * @augments Marionette.CompositeView
 */
var $ = Backbone.$,
	DefaultPanel;

DefaultPanel = Marionette.CompositeView.extend( {

    ui : {
        backButton : '.back-button'
    },

    triggers : {
        'click @ui.backButton': 'back:home'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : require( './panel-empty' ),

    emptyViewOptions : function() {
        return {
            type : this.model.get( 'type' )
        };
    },

    childViewContainer : '#items',

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return window.Tailor.Items.lookup( this.model.get( 'type' ) );
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
        switch ( this.model.get( 'type' ) ) {

            case 'library':
                return ! _.contains( [ 'tailor_row' ], child.get( 'tag' ) ) && ! _.contains( [ 'child', 'inline' ], child.get( 'type' ) );
                break;

            case 'default':
                return child.get( 'panel' ) === this.model.get( 'id' );
                break;

            default:
                return true;
                break;
        }
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.model.get( 'type' ) || 'default';
        return '#tmpl-tailor-panel-' + type;
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.items = this.collection;
        return data;
    },

	/**
     * Sets focus on the back button when the panel is displayed.
     *
     * @since 1.0.0
     */
    onShow : function() {
        this.ui.backButton.get(0).focus();
    }

} );

module.exports = DefaultPanel;
},{"./panel-empty":34}],34:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

    className : 'empty',

    initialize : function( options ) {
        this.type = options.type;
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.type || 'default';
        return '#tmpl-tailor-panel-' + type + '-empty';
    }

} );
},{}],35:[function(require,module,exports){
/**
 * Tailor.Panels.Templates
 *
 * The templates panel.
 *
 * @augments Marionette.CompositeView
 */
var $ = Backbone.$,
    TemplatesPanel;

TemplatesPanel = Marionette.CompositeView.extend( {

    ui : {
        backButton : '.back-button',
        save : '.js-save-template',
        import : '.js-import-template',
        searchForm : '.search-form'
    },

    events : {
        'click @ui.save' : 'save',
        'click @ui.import' : 'import'
    },

    triggers : {
        'click @ui.backButton': 'back:home'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : require( './panel-empty' ),

    emptyViewOptions : function() {
        return {
            type : this.model.get( 'type' )
        };
    },

    template : '#tmpl-tailor-panel-templates',

    childViewContainer : '#items',

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return window.Tailor.Items.lookup( this.model.get( 'type' ) );
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.items = this.collection;
        return data;
    },

	/**
	 * Sets focus on the back button when the panel is displayed.
	 *
	 * @since 1.0.0
	 */
    onShow : function() {
        this.ui.backButton.get(0).focus();
        if ( 0 === this.collection.length ) {
            this.ui.searchForm.hide();
        }
    },

	/**
	 * Shows the search form after a child is added.
	 *
	 * @since 1.0.0
	 */
    onAddChild : function() {
        //if ( 1 === this.collection.length ) {
		this.ui.searchForm.show();
        //}
    },

	/**
	 * Hides the search form if there are no saved templates after a template is removed.
	 *
	 * @since 1.0.0
	 */
    onRemoveChild : function() {
        if ( 0 === this.collection.length ) {
            this.ui.searchForm.hide();
        }
    },

	/**
	 * Opens the Import Template dialog.
	 *
	 * @since 1.0.0
	 */
    import : function( e ) {

        var that = this;
        var options = {
            title : window._l10n.importTemplate,
            content : document.querySelector( '#tmpl-tailor-dialog-import-template').innerHTML,
            button : window._l10n.import,

            onOpen : function() {
                this.el.querySelector( '#import-template' ).focus();
            },

            onValidate : function() {

                var input = this.el.querySelector( '#import-template' );
                var re = /(?:\.([^.]+))?$/;

                return input.value && ( 'json' === re.exec( input.value )[1] );
            },

            onSave : function() {
                var input = this.el.querySelector( '#import-template' );
                var file = input.files[0];

                if ( ! file || file.name.match( /.+\.json/ ) ) {

                    var reader = new FileReader();

                    reader.onload = function( e ) {

                        var defaults = {
                            label : '',
                            tag : '',
                            models : [],
                            nonce : window._nonces.saveTemplate
                        };

                        var data = _.extend( defaults, JSON.parse( reader.result ) );

                        data.models = JSON.stringify( data.models );

                        that.createTemplate( data, 'import' );
                    };

                    try {
                        reader.readAsText( file );
                    }
                    catch( e ) {}
                }
            },

            onClose : function() {
                that.ui.import.focus();
            }
        };

		/**
         * Fires when the dialog window is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'dialog:open', options );
    },

	/**
	 * Opens the Save Template dialog.
	 *
	 * @since 1.0.0
	 */
    save : function(  ) {
        var selected = app.channel.request( 'canvas:element:selected' );
        var elements = app.channel.request( 'canvas:elements' );
        var models = [];
        var tag;

        if ( selected && 'function' == typeof selected.get ) {

            var getChildren = function( id ) {
                _.each( elements.where( { parent : id } ), function( model ) {
                    models.push( model.toJSON() );
                    getChildren( model.get( 'id' ) );
                } );
            };

            if ( 'child' == selected.get( 'type' ) ) {
                selected = selected.collection.get( selected.get( 'parent' ) );
            }

            getChildren( selected.get( 'id' ) );

            selected = selected.toJSON();
            selected.parent = '';
            models.push( selected ) ;
            tag = selected.tag;

        }
        else {

            models = elements.models;
            tag = 'tailor_section';
        }

        var that = this;

        var options = {
            title : window._l10n.saveTemplate,
            content : document.querySelector( '#tmpl-tailor-dialog-save-template').innerHTML,
            button : window._l10n.save,

            onOpen : function() {
                this.el.querySelector( '#save-template' ).focus();
            },

            onValidate : function() {
                var input = this.el.querySelector( '#save-template' );
                return input.value;
            },

            onSave : function() {
                var input = this.el.querySelector( '#save-template' );

                var data = {
                    label : input.value,
                    tag : tag,
                    models : JSON.stringify( models ),
                    nonce : window._nonces.saveTemplate
                };

                that.createTemplate( data, 'save' );
            },

            onClose : function() {
                that.ui.save.focus();
            }
        };

        /**
         * Fires when the dialog window is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'dialog:open', options );
    },

    /**
     * Sends a request to the server to register a new template.
     *
     * @since 1.0.0
     *
     * @param data
     * @param action
     */
    createTemplate : function( data, action ) {

        action = action || 'save';

        var that = this;
        var collection = that.collection;

        that.ui.save.prop( 'disabled', true );
        that.ui.import.prop( 'disabled', true );

        var options = {
            data : data,

            success : function( response ) {
                collection.add( {
                    id : response.id,
                    label : response.label,
                    tag : response.tag,
                    type : response.type
                } );

                /**
                 * Fires when a template is created.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'template:' + action );
            },

            complete : function() {
                that.ui.save.prop( 'disabled', false );
                that.ui.import.prop( 'disabled', false );
            }
        };

        window.ajax.send( 'tailor_save_template', options );
    }

} );

module.exports = TemplatesPanel;
},{"./panel-empty":34}],36:[function(require,module,exports){
/**
 * Tailor.Sections.Default
 *
 * A default section.
 *
 * @augments Marionette.CompositeView
 */
var $ = Backbone.$,
    DefaultSection;

DefaultSection = Marionette.CompositeView.extend( {

    ui: {
        backButton : '.back-button'
    },

    triggers : {
        'click @ui.backButton': 'back:panel'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : require( './section-empty' ),

    childViewContainer : '#controls',

    /**
     * Initializes the section view.
     *
     * @since 1.0.0
     * @param options
     */
    initialize : function( options ) {
        this.panel = options.panel;
    },

    /**
     * Returns the appropriate child view based on the control type.
     *
     * @since 1.0.0
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return window.Tailor.Controls.lookup( child.get( 'type' ) );
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
        if ( 'default' === this.model.get( 'type' ) ) {
            return child.get( 'section' ) === this.model.get( 'id' )
        }
        return true;
    },

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-section-' + this.model.get( 'type' );
    },

    /**
     * Serializes the data that is provided to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.panel = this.panel.get( 'title' );
        return data;
    },

	/**
	 * Sets focus on the back button and refreshes code editors when the section is displayed.
	 *
	 * @since 1.0.0
	 */
    onShow : function() {
        this.ui.backButton.get(0).focus();
        this.children.each( function( control ) {
            if ( 'code' === control.model.get( 'type' ) ) {
                control.editor.refresh();
            }
        }, this );
    }

} );

module.exports = DefaultSection;
},{"./section-empty":37}],37:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

    className : 'empty',

    /**
     * Returns the appropriate template based on the section type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.model.get( 'type' ) || 'default';
        return '#tmpl-tailor-section-' + type + '-empty';
    }

} );
},{}],38:[function(require,module,exports){
/**
 * Tailor.Collections.Control
 *
 * The control collection.
 *
 * @augments Backbone.Collection
 */
var $ = Backbone.$,
    ControlCollection;

ControlCollection = Backbone.Collection.extend( {

	model : require( '../models/control' ),

    /**
     * Initializes the controls collection.
     *
     * @since 1.0.0
     */
    initialize : function( models, options ) {
        if ( options && options.settings ) {
            this.settings = options.settings;
        }

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'reset', this.onReset );
    },

    /**
     * Assigns settings to each control in the collection.
     *
     * @since 1.0.0
     */
    onReset : function() {
        if ( this.settings ) {
            this.each( function( model ) {
                var setting = this.settings.findWhere( { id : model.get( 'setting' ) } );
                if ( setting ) {
                    model.setting = setting;
                }
            }, this );
        }
    }

} );

module.exports = ControlCollection;
},{"../models/control":45}],39:[function(require,module,exports){
/**
 * Tailor.Collections.Library
 *
 * The library collection.
 *
 * @augments Tailor.Collections.Searchable
 */
var $ = Backbone.$,
	SearchableCollection = require( './searchable' ),
	LibraryCollection;

LibraryCollection= SearchableCollection.extend( {

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
        var Model = window.Tailor.Models.lookup( attrs.tag, attrs.type );
        return new Model( attrs, options );
    },

	comparator : 'label',

	/**
	 * Returns the attributes of a model to use in a search.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @returns {string}
	 */
	getHaystack : function( model ) {
		return [
			model.get( 'label' ),
			model.get( 'type' ),
			model.get( 'description' ),
			model.get( 'badge' ),
			model.get( 'tag' )
		].join( ' ' );
	}

} );

module.exports = LibraryCollection;
},{"./searchable":41}],40:[function(require,module,exports){
/**
 * Tailor.Collections.Panel
 *
 * The panel collection.
 *
 * @augments Backbone.Collection
 */
var $ = Backbone.$,
	PanelCollection;

PanelCollection = Backbone.Collection.extend( {
	model : require( '../models/panel' )
} );

module.exports = PanelCollection;
},{"../models/panel":49}],41:[function(require,module,exports){
/**
 * Tailor.Collections.Searchable
 *
 * A searchable collection.
 *
 * @augments Backbone.Collection
 */
var $ = Backbone.$,
	SearchableCollection;

SearchableCollection = Backbone.Collection.extend( {

	/**
	 * Performs a search based on a given search term.
	 *
	 * @since 1.0.0
	 *
	 * @param value
	 */
	doSearch: function( value ) {

		// Don't do anything if we've already done this search
		if ( this.terms === value ) {
			return;
		}
		this.terms = value;

		if ( this.terms.length > 0 ) {
			this.search( this.terms );
		}

		// If search is blank, show all items
		if ( this.terms === '' ) {
			this.each( function( item ) {
				item.set( 'match', true );
			} );
		}
	},

	/**
	 * Shows or hides items based on whether they match the search criteria.
	 *
	 * @since 1.0.0
	 *
	 * @param term
	 */
	search: function( term ) {
		var match, haystack;

		// Escape the term string for RegExp meta characters
		term = term.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );

		// Consider spaces as word delimiters and match the whole string so matching terms can be combined
		term = term.replace( / /g, ')(?=.*' );

		match = new RegExp( '^(?=.*' + term + ').+', 'i' );

		this.each( function( item ) {
			haystack = this.getHaystack( item );
			item.set( 'match', match.test( haystack ) );
		}, this );
	}

} );

module.exports = SearchableCollection;
},{}],42:[function(require,module,exports){
/**
 * Tailor.Collections.Section
 *
 * The section collection.
 *
 * @augments Backbone.Collection
 */
var $ = Backbone.$,
	SectionCollection;

SectionCollection = Backbone.Collection.extend( {
	model : require( '../models/section' )
} );

module.exports = SectionCollection;
},{"../models/section":50}],43:[function(require,module,exports){
/**
 * Tailor.Collections.Setting
 *
 * The setting collection.
 *
 * @augments Backbone.Collection
 */
var $ = Backbone.$,
	SettingCollection;

SettingCollection = Backbone.Collection.extend( {

	model : require( '../models/setting' ),

    /**
     * Initializes the setting collection.
     *
     * @since 1.0.0
     */
    initialize : function( models, options ) {
        if ( options && options.element ) {
            this.element = options.element;
        }

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'reset', this.load );
    },

	/**
     * Assigns the initial value to the setting.
     *
     * @since 1.0.0
     */
    load : function() {
        var atts = this.element.get( 'atts' );
        this.each( function( model ) {
            model.set( 'value', atts[ model.get( 'id' ) ] || '' );
        }, this );
    }

} );

module.exports = SettingCollection;
},{"../models/setting":51}],44:[function(require,module,exports){
/**
 * Tailor.Collections.Template
 *
 * The template collection.
 *
 * @augments Tailor.Collections.Searchable
 */
var $ = Backbone.$,
	SearchableCollection = require( './searchable' ),
	TemplateCollection;

TemplateCollection = SearchableCollection.extend( {

	model : require( '../models/template' ),

	comparator : 'name',

	/**
	 * Returns the attributes of a model to use in a search.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @returns {string}
	 */
	getHaystack : function( model ) {
		return [
			model.get( 'id' ),
			model.get( 'label' )
		].join( ' ' );
	}

} );

module.exports = TemplateCollection;
},{"../models/template":52,"./searchable":41}],45:[function(require,module,exports){
/**
 * Tailor.Models.Control
 *
 * The control model.
 *
 * @augments Backbone.Model
 */
var ControlModel;

ControlModel = Backbone.Model.extend( {

    /**
     * The default parameters for a control.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
		label : '',
		description : '',
		type : '',
		choices : {},
		priority : 0,
		setting : '',
		value : null,
		section : '' // Only used for controls on the Settings panel
	}
} );

module.exports = ControlModel;
},{}],46:[function(require,module,exports){
/**
 * Tailor.Models.Element
 *
 * The element model.
 *
 * @augments Backbone.Model
 */
var $ = Backbone.$,
	ElementModel;

ElementModel = Backbone.Model.extend( {

    /**
     * The default model parameters.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {

        return {
            label : '',
            description : '',
            tag : '',
            icon : '',
            sections : [],
            controls : [],
            type : 'default',
            child : '',
            collection : 'library'
        };
    },

    /**
     * Initializes the model.
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
        this.listenTo( this, 'element:add:center', this.createChild );
    },

    /**
     * Creates and inserts an element before the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) - 1 );
    },

    /**
     * Creates and inserts an element after the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates a new element at the given position.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     */
    insertAtIndex : function( model, index ) {
        model.collection.create( [ {
            tag : this.get( 'tag' ),
            label : this.get( 'label' ),
            parent : model.get( 'parent' ),
            type : this.get( 'type' ),
            order : index
        } ], {} );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) - 1 );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : column.get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : _.first( columns ).get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );

            view.model.collection.insertChild( view.model, _.last( columns ) );

        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {

        var parentId = view.model.get( 'parent' );

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : column.get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : _.last( columns ).get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );

            view.model.collection.insertChild( view.model, _.first( columns ) );
        }
    },

    /**
     * Inserts the element inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    createChild : function( view ) {
        var parentId = view.model.get( 'id' );
        var childTag = view.model.get( 'child' );
        var numberChildren = view.model.collection.where( { parent : parentId, tag : childTag } ).length;
        var wrapper = view.model.collection.createWrapper( childTag, parentId, numberChildren, false );

        var child = view.model.collection.create( [ {
            tag : this.get( 'tag' ),
            label : this.get( 'label' ),
            parent : wrapper.get( 'id' ),
            type : this.get( 'type' ),
            order : 0
        } ], {
            at : 0
        } );
    }

} );

module.exports = ElementModel;
},{}],47:[function(require,module,exports){
/**
 * Tailor.Models.Container
 *
 * The container model.
 *
 * @augments Backbone.Model
 */
var $ = Backbone.$,
    ContainerModel;

ContainerModel = Backbone.Model.extend( {

    /**
     * The default model parameters.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {

        return {
            label : '',
            description : '',
            tag : '',
            icon : '',
            sections : [],
            controls : [],
            type : 'default',
            child : '',
            collection : 'library'
        };
    },

    /**
     * Initializes the model.
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
    },

    /**
     * Creates and inserts an element before the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates and inserts an element after the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) + 1 );
    },

    /**
     * Creates a new wrapper element at the given position.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     */
    insertAtIndex : function( model, index ) {
        var tag = 'tailor_content';
        var children = model.collection.create( [ {
            tag : tag,
            atts : {}
        }, {
            tag : tag,
            atts : {}
        } ], {
            silent : true
        } );

        model.collection.createContainer( this, model.get( 'parent' ), index, children );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );
        var tag = 'tailor_content';
        var children;

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) - 1 );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, column.get( 'id' ), 0, children );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.insertChild( view.model, _.last( columns ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, _.first( columns ).get( 'id' ), 0, children );
        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var parentId = view.model.get( 'parent' );
        var tag = 'tailor_content';
        var children;

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, column.get( 'id' ), 0, children );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.insertChild( view.model, _.first( columns ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, _.last( columns ).get( 'id' ), 0, children );
        }
    }

} );

module.exports = ContainerModel;
},{}],48:[function(require,module,exports){
/**
 * Tailor.Models.Wrapper
 *
 * The wrapper model.
 *
 * @augments Backbone.Model
 */
var $ = Backbone.$,
    WrapperModel;

WrapperModel = Backbone.Model.extend( {

    /**
     * The default model parameters.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {

        return {
            label : '',
            description : '',
            tag : '',
            icon : '',
            sections : [],
            controls : [],
            type : 'default',
            child : '',
            collection : 'library'
        };
    },

    /**
     * Initializes the model.
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
        this.listenTo( this, 'element:add:center', this.createChild );
    },

    /**
     * Creates and inserts an element before the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) - 1 );
    },

    /**
     * Creates and inserts an element after the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates a new wrapper element at the given position.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     */
    insertAtIndex : function( model, index ) {
        model.collection.createWrapper( this.get( 'tag' ), model.get( 'parent' ), index );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );
        var index = view.model.get( 'order' ) - 1;
        var tag = 'tailor_content';

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, index );
            view.model.collection.createWrapper( this.get( 'tag' ), column.get( 'id' ), 0 );
        }
        else {

            var columns = view.model.collection.createRow( parentId, index );
            view.model.collection.insertChild( view.model, _.last( columns ) );
            view.model.collection.createWrapper( this.get( 'tag' ), _.first( columns ).get( 'id' ), 0 );
        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var parentId = view.model.get( 'parent' );
        var index = view.model.get( 'order' );
        var tag = 'tailor_content';

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, index );
            view.model.collection.createWrapper( this.get( 'tag' ), column.get( 'id' ), 0 );
        }
        else {

            var columns = view.model.collection.createRow( parentId, index );
            view.model.collection.insertChild( view.model, _.first( columns ) );
            view.model.collection.createWrapper( this.get( 'tag' ), _.last( columns ).get( 'id' ), 0 );

        }
    },

    /**
     * Inserts the element inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    createChild : function( view ) {
        var parentId = view.model.get( 'id' );
        var childTag = view.model.get( 'child' );
        var numberChildren = view.model.collection.where( { parent : parentId, tag : childTag } ).length;
        var wrapper = view.model.collection.createWrapper( childTag, parentId, numberChildren, false );

        view.model.collection.createWrapper( this.get( 'tag' ), wrapper.get( 'id' ), 0 );
    }

} );

module.exports = WrapperModel;
},{}],49:[function(require,module,exports){
/**
 * Tailor.Models.Panel
 *
 * The panel model.
 *
 * @augments Backbone.Model
 */
var PanelModel;

PanelModel = Backbone.Model.extend( {

    /**
     * The default parameters for a panel.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
		title : '',
		description : '',
		collection : '',
		priority : 0
	}
} );

module.exports = PanelModel;
},{}],50:[function(require,module,exports){
/**
 * Tailor.Models.Section
 *
 * The section model.
 *
 * @augments Backbone.Model
 */
var SectionModel;

SectionModel = Backbone.Model.extend( {

    /**
     * The default parameters for a section.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
		title : '',
		description : '',
		priority : 0,
		panel : ''
	}
} );

module.exports = SectionModel;
},{}],51:[function(require,module,exports){
/**
 * Tailor.Models.Setting
 *
 * The setting model.
 *
 * @augments Backbone.Model
 */
var SettingModel;

SettingModel = Backbone.Model.extend( {

    /**
     * The default parameters for a setting.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
        type : '',
		value : '',
		default : null
	}
} );

module.exports = SettingModel;
},{}],52:[function(require,module,exports){
/**
 * Tailor.Models.Template
 *
 * The template model.
 *
 * @augments Backbone.Model
 */
var TemplateModel;

TemplateModel = Backbone.Model.extend( {

    /**
     * Returns an object containing the default parameters for a template.
     *
     * @since 1.0.0
     * @returns object
     */
    defaults : function() {
        return {
            id : this.cid,
            label : '',
            collection : 'template'
        };
    },

    /**
     * Initializes the element model.
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
        this.listenTo( this, 'element:add:center', this.createChild );
    },

    createChild : function( view ) {
        var parentId = view.model.get( 'id' );
        var childTag = view.model.get( 'child' );
        var numberChildren = view.model.collection.where( { parent : parentId, tag : childTag } ).length;
        var wrapper = view.model.collection.createWrapper( childTag, parentId, numberChildren, false );

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, wrapper.get( 'id' ), 0 );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) - 1 );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, column.get( 'id' ), 0 );

        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, _.first( columns ).get( 'id' ), 0 );
            view.model.collection.insertChild( view.model, _.last( columns ) );
        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var parentId = view.model.get( 'parent' );

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, column.get( 'id' ), 0 );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, _.last( columns ).get( 'id' ), 0 );

            view.model.collection.insertChild( view.model, _.first( columns ) );
        }
    },

    /**
     * Creates and inserts a template before the target view inside a section.
     *
     * @since 1.0.0
     * @param view
     */
	insertBefore : function( view ) {

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, view.model.get( 'parent' ), view.model.get( 'order' ) - 1 );
	},

	insertAfter : function( view ) {

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, view.model.get( 'parent' ), view.model.get( 'order' ) );
    }

} );

module.exports = TemplateModel;
},{}],53:[function(require,module,exports){
Tailor.Collections = Tailor.Collections || {};

Tailor.Collections.Library = require( './collections/library' );
Tailor.Collections.Template = require( './collections/templates' );
Tailor.Collections.Panel = require( './collections/panels' );
Tailor.Collections.Section = require( './collections/sections' );
Tailor.Collections.Setting = require( './collections/settings' );
Tailor.Collections.Control = require( './collections/controls' );

module.exports = Marionette.Module.extend( {

	onBeforeStart : function( options ) {
        var module = this;
        var library = new Tailor.Collections.Library( options.library );
        var templates = new Tailor.Collections.Template( options.templates );

        module.panels = new Tailor.Collections.Panel( options.panels );
        module.sections = { sidebar : new Tailor.Collections.Section( options.sections ) };
        module.settings = { sidebar : new Tailor.Collections.Setting( options.settings ) };
        module.controls = {
            sidebar : new Tailor.Collections.Control( options.controls, {
                silent : false,
                settings : module.settings['sidebar']
            } )
        };

		var api = {

            /**
             * Returns a given library item if a tag is provided, otherwise the library.
             *
             * @since 1.0.0
             *
             * @param tag
             * @returns {*}
             */
            getLibraryItems : function( tag ) {
                return tag ? library.findWhere( { tag : tag } ) : library;
            },

            /**
             * Returns the template item collection.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            getTemplates : function() {
                return templates;
            },

            /**
             * Returns a given panel if an ID is provided, otherwise the panel collection.
             *
             * @since 1.0.0
             *
             * @param id
             * @returns {*}
             */
            getPanels : function( id ) {
                return id ? module.panels.findWhere( { id : id } ) : module.panels;
            },

            /**
             * Returns the collection of sections for a given element.
             *
             * If no element model is is provided, the sidebar sections collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getSections : function( model ) {

                // Return the sidebar section collection if no element is provided
                if ( ! model ) {
                    return module.sections['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.sections.hasOwnProperty( cid ) ) {
                    var libraryItem = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var sections = libraryItem.get( 'sections' ) || [];

                    module.sections[ cid ] = new Tailor.Collections.Section( sections );
                }

                // Return the element control collection
                return module.sections[ cid ];
            },

            /**
             * Returns the collection of controls for a given element.
             *
             * If no element model is is provided, the sidebar control collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getControls : function( model ) {

                // Return the sidebar control collection if no element is provided
                if ( ! model ) {
                    return module.controls['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.controls.hasOwnProperty( cid ) ) {
                    var libraryItem = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var controls = libraryItem.get( 'controls' ) || [];
                    var settings = api.getSettings( model );
                    var options = {
                        silent : false,
                        settings : settings
                    };

                    module.controls[ cid ] = new Tailor.Collections.Control( controls, options );
                }

                // Return the element control collection
                return module.controls[ cid ];
            },

            /**
             * Returns the collection of settings for a given element.
             *
             * If no element model is is provided, the sidebar settings collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getSettings : function( model ) {

                // Return the sidebar control collection if no element is provided
                if ( ! model ) {
                    return module.settings['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.settings.hasOwnProperty( cid ) ) {
                    var libraryItem = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var settings = libraryItem.get( 'settings' ) || [];

                    module.settings[ cid ] = new Tailor.Collections.Setting( settings, { element : model } );
                }

                module.settings[ cid ].load();

                // Return the element control collection
                return module.settings[ cid ];
            }
		};

        app.channel.reply( 'sidebar:library', api.getLibraryItems );
        app.channel.reply( 'sidebar:templates', api.getTemplates );
        app.channel.reply( 'sidebar:panels', api.getPanels );
        app.channel.reply( 'sidebar:sections sidebar:default', api.getSections );
        app.channel.reply( 'sidebar:controls', api.getControls );
        app.channel.reply( 'sidebar:settings', api.getSettings );

        this.listenTo( module.settings['sidebar'], 'change', this.onChangeSetting );
	},

    /**
     * Triggers an event on the applcation communication channel when a sidebar setting changes.
     *
     * @since 1.0.0
     *
     * @param setting
     */
    onChangeSetting : function( setting ) {

        /**
         * Fires when a sidebar setting changes.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'sidebar:setting:change', setting );
    }

} );
},{"./collections/controls":38,"./collections/library":39,"./collections/panels":40,"./collections/sections":42,"./collections/settings":43,"./collections/templates":44}],54:[function(require,module,exports){
module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
        var DialogView = require( './dialog/show/dialog' );
		var api = {

            /**
             * Opens the dialog window.
             *
             * @since 1.0.0
             *
             * @param options
             */
			showDialog : function( options ) {
                app.dialog.show( new DialogView( options ) );
			}
		};

		this.listenTo( app.channel, 'dialog:open', api.showDialog );
    }

} );
},{"./dialog/show/dialog":56}],55:[function(require,module,exports){
module.exports = Backbone.Marionette.Region.extend( {

    /**
     * Initializes the dialog region.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.$overlay = jQuery( '<div id="overlay"></div>' );
    },

    /**
     * Shows the dialog window and adds necessary event listeners.
     *
     * @since 1.0.0
     */
    onShow : function( view, region, options ) {
        this.el.classList.add( 'is-visible' );
        this.$overlay
            .on( 'click', jQuery.proxy( this.empty, this ) )
            .appendTo( 'body' );
    },

    /**
     * Hides the dialog window and removes event listeners.
     *
     * @since 1.0.0
     */
    onEmpty : function( view, region, options ) {
        this.el.classList.remove( 'is-visible' );
        this.$overlay
            .off()
            .detach();
    }

} );
},{}],56:[function(require,module,exports){
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
},{}],57:[function(require,module,exports){
module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
        var ModalView = require( './modal/show/modal' );
		var api = {

            /**
             * Opens a modal window to edit the given element.
             *
             * @since 1.0.0
             *
             * @param model
             */
			openModal : function( model ) {

                // Closes the current modal window and prompts the user to save any unsaved changes
                if ( app.modal.hasView() ) {
                    if ( model === app.modal.currentView.model ) {
                        return;
                    }

                    app.modal.currentView.triggerMethod( 'close' );
                }

                app.modal.show( new ModalView( {
                    model : model
                } ) );
			},

            /**
             * Closes the current modal window.
             *
             * @since 1.0.0
             */
            closeModal : function() {
                app.modal.empty();
            }
		};

		this.listenTo( app.channel, 'modal:open', api.openModal );
		this.listenTo( app.channel, 'elements:reset', api.closeModal );
    }

} );
},{"./modal/show/modal":61}],58:[function(require,module,exports){
module.exports = Backbone.Marionette.Region.extend( {

    /**
     * Displays the modal container and sets the initial modal window position.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onShow : function( view, region, options ) {
        this.el.classList.add( 'is-visible' );

        var rect = this.el.getBoundingClientRect();
        var width = this.el.style.width ? this.el.style.width : rect.width;

        this.el.style.width = width + 'px';

        if ( ! this.el.style.height ) {
            this.el.style.height = ( window.innerHeight - 80 ) + 'px';
        }

        if ( ! this.el.style.top  ) {
            this.el.style.top = '40px';
        }

        if ( ! this.el.style.left ) {
            if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
                this.el.style.left = 40 + 'px';
            }
            else {
                this.el.style.left = window.innerWidth - ( rect.width + 40 ) + 'px';
            }
        }

        // Update the element class name
        this.updateClassName( width );

        // Listen to resize events on the modal view
        this.listenTo( view, 'modal:resize', this.onResize );
    },


    /**
     * Responds to changes in the modal width and/or height.
     *
     * @since 1.0.0
     *
     * @param width
     * @param height
     */
    onResize : function( width, height ) {
        this.updateClassName( width );
    },

    /**
     * Updates the container class name based on the width.
     *
     * @since 1.0.0
     *
     * @param width
     */
    updateClassName : function( width ) {
        this.$el
            .toggleClass( 'is-x-small', width < 480 )
            .toggleClass( 'is-small', ( 481 < width ) && ( width < 767 ) )
            .toggleClass( 'is-medium', ( 768 < width ) && ( width < 979 ) )
            .toggleClass( 'is-large', ( 980 < width ) && ( width < 1199 ) )
            .toggleClass( 'is-x-large', width >= 1200 );
    },

    /**
     * Hides the modal container.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onEmpty : function( view, region, options ) {
        this.el.classList.remove( 'is-visible' );
	    this.stopListening( view, 'modal:resize', this.onResize );
    }

} );
},{}],59:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

    className : 'tailor-empty',

    template : '#tmpl-tailor-modal-empty'

} );
},{}],60:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

    className : 'tailor-empty',

    template : '#tmpl-tailor-section-default-empty'

} );
},{}],61:[function(require,module,exports){
/**
 * Modal view for editing element settings.
 *
 * @class
 */
var $ = window.jQuery,
	ModalView;

ModalView = Marionette.LayoutView.extend( {

	className : 'modal',

	ui : {
		close : '.js-close',
        preview : '.js-preview',
		apply : '.js-apply'
	},

    behaviors : {
        Resizable : {
            ui : {
                handle : '.modal__title'
            }
        }
    },

    triggers : {
        'click @ui.close' : 'close',
        'click @ui.preview' : 'preview',
        'click @ui.apply' : 'apply'
    },

    modelEvents : {
        'destroy' : 'destroy'
    },

	template : '#tmpl-tailor-modal',

	regions: {
        tabs : '#tailor-modal-tabs',
		sections : '#tailor-modal-sections'
	},

    /**
     * Initializes the modal window.
     *
     * @since 1.0.0
     *
     * @param options
     */
	initialize : function( options ) {
        this.isModified = false;
        this.settings = app.channel.request( 'sidebar:settings', this.model );
        this.addEventListeners();

        /**
         * Fires when the modal window is initialized.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:initialize', this, this.model );
	},

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.settings, 'change', this.onChange );
    },

    /**
     * Renders the modal tabs and sections.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var sections = app.channel.request( 'sidebar:sections', this.model );
        var controls = app.channel.request( 'sidebar:controls', this.model );
        var SectionsView = require( './sections' );
        this.showChildView( 'sections', new SectionsView( {
            element : this.model,
            collection : sections,
            controls : controls
        } ) );

        if ( sections.length > 1 ) {
            var TabsView = require( './tabs' );
            this.showChildView( 'tabs', new TabsView( {
                collection : sections
            } ) );

            this.el.classList.add( 'has-sections' );
        }

        this.model.collection.trigger( 'edit', this.model, true );
    },

    /**
     * Sets the initial focus and checks the position of the modal window when it is first shown.
     *
     * @since 1.0.0
     */
    onShow : function() {
        this.ui.close.focus();
    },

    /**
     * Updates the modal window controls when an element setting is changed.
     *
     * @since 1.0.0
     */
    onChange : function() {
        this.isModified = true;
        this.ui.preview.attr( 'disabled', false );
        this.ui.apply.attr( 'disabled', false );
    },

    /**
     * Previews current changes without applying them.
     *
     * @since 1.0.0
     */
    onPreview : function() {
        if ( ! this.model.isTracking() ) {
            this.model.startTracking();
        }

	    this.model.set( 'atts', this._getAttributes() );
        this.ui.preview.attr( 'disabled', true );

        /**
         * Fires when element settings are previewed.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:preview', this, this.model );
    },

    /**
     * Closes the modal window and applies changes.
     *
     * @since 1.0.0
     */
    onApply : function() {
        this.model.stopTracking();
	    this.model.set( 'atts', this._getAttributes() );

        /**
         * Fires when element settings are applied.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:apply', this, this.model );

        this.triggerMethod( 'destroy' );
    },

    /**
     * Closes the modal window.
     *
     * The user is prompted to apply changes, if changes have been made (and not already previewed).
     *
     * @since 1.0.0
     */
    onClose : function() {
        if ( this.isModified ) {
            var applyChanges = confirm( 'You have made changes to this element.  Would you like to apply them?' );

            if ( true === applyChanges ) {
                this.triggerMethod( 'apply' );
            }
            else {
                this.model.resetAttributes();
            }
        }

        /**
         * Fires when the modal window is closed.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:close', this );

        this.triggerMethod( 'destroy' );
    },

    /**
     * Triggers an event when the modal window is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.model.collection.trigger( 'edit', this.model, false );

        /**
         * Fires when the modal window is destroyed.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:destroy', this, this.model );
    },

    /**
     * Returns the current setting values.
     *
     * @since 1.0.0
     *
     * @returns {{}}
     * @private
     */
    _getAttributes : function() {
        var atts = {};

        this.settings.each( function( setting ) {
            atts[ setting.get( 'id' ) ] = setting.get( 'value' );
        }, this );

        return atts;
    }

} );

module.exports = ModalView;
},{"./sections":63,"./tabs":65}],62:[function(require,module,exports){
module.exports = Marionette.CollectionView.extend( {

	tagName : 'ul',

    className : 'controls controls--modal',

    emptyView : require( './empty-section' ),

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return window.Tailor.Controls.lookup( child.get( 'type' ) );
    },

    /**
     * Returns the appropriate set of options for the child view.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     * @returns {{model: *}}
     */
    childViewOptions : function( model, index ) {
        var options = { model : model };

        if ( 'list' === model.get( 'type' ) ) {
            options.element = this.element;
            options.collection = this.element.collection;
        }

        return options;
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
        return child.get( 'section' ) === this.model.get( 'id' )
    },

    /**
     * Initializes the modal section.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.model = options.model;
        this.element = options.element;

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.collection, 'select', this.onSelect );
    },

	/**
     * Toggles the section visibility when a section tab is selected.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSelect : function( model ) {
        this.$el.toggle( model === this.model );
    }

} );
},{"./empty-section":60}],63:[function(require,module,exports){
module.exports = Marionette.CollectionView.extend( {

    childView : require( './section' ),

    emptyView : require( './empty-modal' ),

    /**
     * Returns the appropriate set of options for the child view.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     * @returns {{model: *}}
     */
    childViewOptions : function( model, index ) {

        return {
            model : model,
            element : this.element,
            collection : this.controls
        };
    },

    initialize : function( options ) {
        this.element = options.element;
        this.controls = options.controls;
    }

} );
},{"./empty-modal":59,"./section":62}],64:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

    tagName : 'li',

    className : 'tab',

    attributes : {
        'tabindex' : 0
    },

    events : {
        'click' : 'select',
        'keypress' : 'onKeyPress'
    },

    template : '#tmpl-tailor-modal-item',

    /**
     * Selects the tab.
     *
     * @since 1.0.0
     */
    select : function() {
        this.triggerMethod( 'select' );
    },

	/**
	 * Triggers a select event on the model.
	 *
	 * @since 1.0.0
	 */
    onSelect : function() {
        this.model.trigger( 'select', this.model );
        this.el.focus();
    },

    /**
     * Triggers select events, if the Enter key is pressed.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
	        this.select();
        }
    }

} );
},{}],65:[function(require,module,exports){
module.exports = Marionette.CollectionView.extend( {

    tagName : 'ul',

    className : 'tabs',

    childView : require( './tab' ),

    childEvents : {
        select : 'onSelect'
    },

	/**
     * Shows the first control section (tab).
     *
     * @since 1.0.0
     */
    onRender : function() {
        if ( this.collection.length > 0 ) {
            this.children.first().triggerMethod( 'select' );
        }
    },

	/**
     * Shows the selected control section (tab).
     *
     * @since 1.0.0
     *
     * @param view
     */
    onSelect : function( view ) {
        this.children.each( function( child ) {
            child.$el.toggleClass( 'is-active', view === child );
        } );
    }

} );
},{"./tab":64}],66:[function(require,module,exports){
module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'sidebar:save', this.onSave );

        this.listenTo( app.channel, 'elements:restore', this.onRestoreElements );

        this.listenTo( app.channel, 'element:delete', this.onDeleteElement );

        this.listenTo( app.channel, 'template:save', this.onSaveTemplate );
        this.listenTo( app.channel, 'template:import', this.onImportTemplate );
        this.listenTo( app.channel, 'template:add', this.onAddTemplate );
        this.listenTo( app.channel, 'template:delete', this.onDeleteTemplate );
    },

    /**
     * Triggers a notification when the page is saved.
     *
     * @since 1.0.0
     */
    onSave : function() {
        Tailor.Notify( window._l10n.savedPage, 'success' );
    },

    /**
     * Triggers a notification when the canvas is restored (e.g., from a history entry).
     *
     * @since 1.0.0
     */
    onRestoreElements : function() {
        Tailor.Notify( window._l10n.restoreElements, 'success' );
    },

    /**
     * Triggers a notification when an element is deleted.
     *
     * @since 1.0.0
     */
    onDeleteElement : function() {
        Tailor.Notify( window._l10n.deletedElement, 'success' );
    },

    /**
     * Triggers a notification when a new template is saved.
     *
     * @since 1.0.0
     */
    onSaveTemplate : function() {
        Tailor.Notify( window._l10n.savedTemplate, 'success' );
    },

    /**
     * Triggers a notification when a template is imported from a JSON file.
     *
     * @since 1.0.0
     */
    onImportTemplate : function() {
        Tailor.Notify( window._l10n.importedTemplate, 'success' );
    },

    /**
     * Triggers a notification when a template is added to the page.
     *
     * @since 1.0.0
     */
    onAddTemplate : function() {
        Tailor.Notify( window._l10n.addedTemplate, 'success' );
    },

    /**
     * Triggers a notification when a template is deleted.
     *
     * @since 1.0.0
     */
    onDeleteTemplate : function() {
        Tailor.Notify( window._l10n.deletedTemplate, 'success' );
    }

} );
},{}],67:[function(require,module,exports){
module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onStart : function( options ) {
        var LayoutView = require( './panels/show/layout' );

        app.content.show( new LayoutView( {
            panels : app.channel.request( 'sidebar:panels' ),
            sections : app.channel.request( 'sidebar:sections' ),
            controls : app.channel.request( 'sidebar:controls' ),
            settings : app.channel.request( 'sidebar:settings' )
        } ) );
    }

} );
},{"./panels/show/layout":68}],68:[function(require,module,exports){
module.exports = Marionette.LayoutView.extend( {

    ui: {
        pageTitle : '.back-button'
    },

    className : 'tailor-sidebar__layout',

    regions : {
        panels : "#tailor-sidebar-home",
        panel : "#tailor-sidebar-panel",
        section : "#tailor-sidebar-section"
    },

    childEvents : {
        'show:panel' : 'showPanel',
        'show:section' : 'showSection',
        'back:home' : 'displayHome',
        'back:panel' : 'displayPanel'
    },

    template : function() {
        return document.getElementById( 'tmpl-tailor-sidebar-layout' ).innerHTML;
    },

    /**
     * Initializes the layout view.
     *
     * @since 1.0.0
     */
    initialize : function( options ) {
        this.panels = options.panels;
        this.sections = options.sections;
        this.controls = options.controls;
        this.settings = options.settings;
    },

	/**
     * Renders the panels.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var PanelsView = require( './panels' );

        this.showChildView( 'panels', new PanelsView( {
            collection : this.panels
        } ) );
    },

	/**
     * Shows a given panel.
     *
     * @since 1.0.0
     *
     * @param view
     */
    showPanel : function( view ) {
        this.displayPanel();

        var collection = app.channel.request( 'sidebar:' + view.model.get( 'type' ) );
        //if ( ! collection ) {
        //    collection = this.sections;
        //}

        var PanelView = window.Tailor.Panels.lookup( view.model.get( 'type' ) );

        this.showChildView( 'panel', new PanelView( {
            model : view.model,
            collection : collection
        } ) );
    },

	/**
     * Shows a given section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    showSection : function( view ) {
        this.el.classList.add( 'section-visible' );
        this.el.classList.remove( 'panel-visible' );

        var SectionView = window.Tailor.Sections.lookup( view.model.get( 'type' ) );
        this.showChildView( 'section', new SectionView( {
            model : view.model,
            collection : this.controls,
            panel : this.panels.findWhere( { id : view.model.get( 'panel' ) } )
        } ) );
    },

	/**
     * Shows the initial Home view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    displayHome : function( view ) {
        this.el.classList.remove( 'panel-visible' );
        this.el.classList.remove( 'section-visible' );

        if ( view ) {
            view.model.trigger( 'focus' );
        }
    },

	/**
     * Shows a given panel.
     *
     * @since 1.0.0
     *
     * @param view
     */
    displayPanel : function( view ) {
        this.el.classList.remove( 'section-visible' );
        this.el.classList.add( 'panel-visible' );

        if ( view ) {
            view.model.trigger( 'focus' );
        }
    }

} );
},{"./panels":70}],69:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

    className : 'tailor-empty',

    template : '#tmpl-tailor-home-empty'

} );
},{}],70:[function(require,module,exports){
module.exports = Marionette.CompositeView.extend( {

    getChildView : function() {
        return window.Tailor.Items.lookup( 'panels' );
    },

    childViewContainer : '#items',

    emptyView : require( './panels-empty' ),

    behaviors : {
        Panel : {}
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    template : '#tmpl-tailor-home'

} );
},{"./panels-empty":69}],71:[function(require,module,exports){

( function( Behaviors ) {

    'use strict';

    Behaviors.Resizable = require( './components/behaviors/resizable' );
    Behaviors.Draggable = require( './components/behaviors/draggable' );
    Behaviors.Panel = require( './components/behaviors/panel' );

    Marionette.Behaviors.behaviorsLookup = function() {
        return Behaviors;
    };

    window.Tailor.Behaviors = Behaviors;

} ) ( window.Tailor.Behaviors || {} );
},{"./components/behaviors/draggable":3,"./components/behaviors/panel":4,"./components/behaviors/resizable":5}],72:[function(require,module,exports){

( function( Panels, Sections, Items, Controls ) {

    'use strict';

    Panels.Default = require( './components/panels/panel-default' );
    Panels.Templates = require( './components/panels/panel-templates' );

    Panels.lookup = function( type ) {

        type = type.replace( /-/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( window.Tailor.Panels.hasOwnProperty( type ) ) {
            return window.Tailor.Panels[ type ];
        }

        return window.Tailor.Panels.Default;
    };

    Sections.Default = require( './components/sections/section-default' );

    Sections.lookup = function( type ) {

        type = type.replace( /-/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Sections.hasOwnProperty( type ) ) {
            return Sections[ type ];
        }

        return Sections.Default;
    };

    Items = window.Tailor.Items || {};
    Items.Default = require( './components/items/item-default' );
    Items.Panels = require( './components/items/item-panels' );
    Items.History = require( './components/items/item-history' );
    Items.Library = require( './components/items/item-library' );
    Items.Templates = require( './components/items/item-templates' );

    Items.lookup = function( type ) {

        type = type.replace( /-/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Items.hasOwnProperty( type ) ) {
            return Items[ type ];
        }

        return Items.Default;
    };

    Controls = window.Tailor.Controls || {};
    Controls.ButtonGroup = require( './components/controls/button-group' );
    Controls.Checkbox = require( './components/controls/checkbox' );
    Controls.Code = require( './components/controls/code' );
    Controls.Colorpicker = require( './components/controls/colorpicker' );
    Controls.Editor = require( './components/controls/editor' );
    Controls.Gallery = require( './components/controls/gallery' );
    Controls.Icon = require( './components/controls/icon' );
    Controls.Image = require( './components/controls/image' );
    Controls.Link = require( './components/controls/link' );
    Controls.List = require( './components/controls/list' );
    Controls.Radio = require( './components/controls/radio' );
    Controls.Range = require( './components/controls/range' );
    Controls.Select = require( './components/controls/select' );
    Controls.SelectMulti = require( './components/controls/select-multi' );
    Controls.Style = require( './components/controls/style' );
    Controls.Switch = require( './components/controls/switch' );
    Controls.Text = require( './components/controls/text' );
    Controls.Textarea = require( './components/controls/textarea' );
    Controls.Video = require( './components/controls/video' );

    Controls.lookup = function( type ) {

        type = type.replace( /-/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Controls.hasOwnProperty( type ) ) {
            return Controls[ type ];
        }

        return Controls.Text;
    };

    window.Tailor.Panels = Panels;
    window.Tailor.Sections = Sections;
    window.Tailor.Items = Items;
    window.Tailor.Controls = Controls;

} ) ( window.Tailor.Panels || {}, window.Tailor.Sections || {}, window.Tailor.Items || {}, window.Tailor.Controls || {} );
},{"./components/controls/button-group":7,"./components/controls/checkbox":8,"./components/controls/code":9,"./components/controls/colorpicker":10,"./components/controls/editor":11,"./components/controls/gallery":12,"./components/controls/icon":13,"./components/controls/image":14,"./components/controls/link":15,"./components/controls/list":18,"./components/controls/radio":19,"./components/controls/range":20,"./components/controls/select":22,"./components/controls/select-multi":21,"./components/controls/style":23,"./components/controls/switch":24,"./components/controls/text":25,"./components/controls/textarea":26,"./components/controls/video":27,"./components/items/item-default":28,"./components/items/item-history":29,"./components/items/item-library":30,"./components/items/item-panels":31,"./components/items/item-templates":32,"./components/panels/panel-default":33,"./components/panels/panel-templates":35,"./components/sections/section-default":36}],73:[function(require,module,exports){

( function( Models ) {

    'use strict';

    Models.Section = require( './entities/models/library/model-wrapper' ); // Sections are just special wrappers
    Models.Element = require( './entities/models/library/element' );
    Models.Container = require( './entities/models/library/model-container' );
    Models.Wrapper = require( './entities/models/library/model-wrapper' );

    Models.lookup = function( tag, type ) {

        tag = tag.replace( /tailor_/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Models.hasOwnProperty( tag ) ) {
            return Models[ tag ];
        }

        type = type.replace( /_/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Models.hasOwnProperty( type ) ) {
            return Models[ type ];
        }

        return Models.Element;
    };

    window.Tailor.Models = Models;

} ) ( window.Tailor.Models || {} );
},{"./entities/models/library/element":46,"./entities/models/library/model-container":47,"./entities/models/library/model-wrapper":48}],74:[function(require,module,exports){
( function( Api, $ ) {

    var title = document.querySelector( '.tailor__home .title' );

    Api( '_post_title', function( to, from ) {

        if ( title.hasChildNodes() ) {
            var children = title.childNodes;
            for ( var i = 1; i < children.length; i++ ) {
                if ( 3 == children[ i ].nodeType && -1 !== children[ i ].nodeValue.indexOf( from ) ) {
                    children[ i ].nodeValue = to;
                }
            }
        }

        document.title = window._l10n.tailoring + to;
    } );

    $( '.preview__control' ).on( 'change', function( e ) {
        var size = this.value;
        var preview = document.querySelector( '.tailor-preview' );
        var viewport = document.querySelector( '.tailor-preview__viewport' );

        viewport.classList.remove( 'is-loaded' );

        setTimeout( function() {
            preview.className = 'tailor-preview ' + size + '-screens';
        }, 250 );

        setTimeout( function() {
            viewport.classList.add( 'is-loaded' );
        }, 1000 );

    } );

    var $buttons = $( '.devices button' );

    $buttons.on( 'click', function( e ) {
        var button = e.target;
        var preview = document.querySelector( '.tailor-preview' );

        $buttons.each( function() {
            if ( this == button ) {
                this.classList.add( 'is-active' );
                this.setAttribute( 'aria-pressed', 'true' );
                preview.className = 'tailor-preview ' + button.getAttribute( 'data-device' ) + '-screens';
            }
            else {
                this.classList.remove( 'is-active' );
                this.setAttribute( 'aria-pressed', 'false' );
            }
        } );

    } );

    $buttons.first().click();

} ) ( Tailor.Api, jQuery );
},{}],75:[function(require,module,exports){
require( './utility/polyfills/classlist' );
require( './utility/polyfills/raf' );

var Application = require( './apps/sidebar' );
window.app = new Application();

window.Tailor = {
    Api : require( './components/api/setting' ),
    Notify : require( './utility/notify' )
};

window.ajax = require( './utility/ajax' );

wp.media.view.settings.post.id = window.post.id;

( function( app, $ ) {

    'use strict';

    require( './sidebar-behaviors' );
    require( './sidebar-components' );
    require( './sidebar-entities' );

    app.addRegions( {

        content : '#tailor-sidebar-content',

        dialog : {
            selector : "#tailor-dialog-container",
            regionClass : require( './modules/dialog/dialog-region' )
        },

        modal : {
            selector : "#tailor-modal-container",
            regionClass : require( './modules/modal/modal-region' )
        }
    } );

    app.on( 'before:start', function( options ) {
        app.module( 'entities:settings', require( './entities/sidebar' ) );
    } );

    app.on( 'start', function( options ) {
        app.module( 'module:panels', require( './modules/panels' ) );
        app.module( 'module:modal', require( './modules/modal' ) );
        app.module( 'module:dialog', require( './modules/dialog' ) );
        app.module( 'module:notification', require( './modules/notification' ) );

        require( './sidebar-preview' );

        $( document ).on( 'heartbeat-send', function( e, data ) {
            data['tailor_post_id'] = window.post.id;
        } );

        wp.heartbeat.interval( 60 );
        wp.heartbeat.connectNow();

        $( window )

        /**
         * Warns the user if they attempt to navigate away from the page without saving changes.
         *
         * @since 1.0.0
         */
            .on( 'beforeunload.tailor', function( e ) {
                if ( app.hasUnsavedChanges() ) {
                    return window._l10n.confirmPage;
                }
            } )

        /**
         * Unlocks the post when the user navigates away from the page.
         *
         * @since 1.0.0
         */
            .on( 'unload.tailor', function( e ) {
                window.ajax.send( 'tailor_unlock_post', {
                    data : {
                        post_id : options.postId,
                        nonce : options.nonces.unlockPost
                    }
                } );
            } );
    } );

    $( document ).ready( function() {
        app.start( {
            postId : window.post.id,
            nonces : window._nonces,
            library : window._library || [],
            templates : window._templates || [],
            panels : window._panels || [],
            sections : window._sections || [],
            settings : window._settings || [],
            controls : window._controls || []
        } );
    } );

} ) ( window.app, jQuery );
},{"./apps/sidebar":1,"./components/api/setting":2,"./entities/sidebar":53,"./modules/dialog":54,"./modules/dialog/dialog-region":55,"./modules/modal":57,"./modules/modal/modal-region":58,"./modules/notification":66,"./modules/panels":67,"./sidebar-behaviors":71,"./sidebar-components":72,"./sidebar-entities":73,"./sidebar-preview":74,"./utility/ajax":76,"./utility/notify":77,"./utility/polyfills/classlist":78,"./utility/polyfills/raf":79}],76:[function(require,module,exports){
/**
 * window.ajax
 *
 * Simple AJAX utility module.
 *
 * @class
 */
var $ = jQuery,
    Ajax;

var Ajax = {

    url : window.ajaxurl,

    /**
     * Sends a POST request to WordPress.
     *
     * @param  {string} action The slug of the action to fire in WordPress.
     * @param  {object} data   The data to populate $_POST with.
     * @return {$.promise}     A jQuery promise that represents the request.
     */
    post : function( action, data ) {
        return ajax.send( {
            data: _.isObject( action ) ? action : _.extend( data || {}, { action: action } )
        } );
    },

    /**
     * Sends a POST request to WordPress.
     *
     * Use with wp_send_json_success() and wp_send_json_error().
     *
     * @param  {string} action  The slug of the action to fire in WordPress.
     * @param  {object} options The options passed to jQuery.ajax.
     * @return {$.promise}      A jQuery promise that represents the request.
     */
    send : function( action, options ) {

        if ( _.isObject( action ) ) {
            options = action;
        }
        else {
            options = options || {};
            options.data = _.extend( options.data || {}, {
                action : action,
                tailor : 1
            } );
        }

        options = _.defaults( options || {}, {
            type : 'POST',
            url : ajax.url,
            context : this
        } );

        return $.Deferred( function( deferred ) {

            if ( options.success ) {
                deferred.done( options.success );
            }

            var onError = options.error ? options.error : ajax.onError;
            deferred.fail( onError );

            delete options.success;
            delete options.error;

            $.ajax( options )
                .done( function( response ) {

                    // Treat a response of `1` as successful for backwards compatibility with existing handlers.
                    if ( response === '1' || response === 1 ) {
                        response = { success: true };
                    }
                    if ( _.isObject( response ) && ! _.isUndefined( response.success ) ) {
                        deferred[ response.success ? 'resolveWith' : 'rejectWith' ]( this, [ response.data ] );
                    }
                    else {
                        deferred.rejectWith( this, [ response ] );
                    }
                } )
                .fail( function() {
                    deferred.rejectWith( this, arguments );
                } );

        } ).promise();
    },

    /**
     * General error handler for AJAX requests.
     *
     * @since 1.0.0
     *
     * @param response
     */
    onError : function( response ) {
        if ( response && response.hasOwnProperty( 'message' ) ) {

            // Display the error from the server
            Tailor.Notify( response.message );
        }
        else if ( '0' == response ) {

            // Session expired
            Tailor.Notify( window._l10n.expired );
        }
        else if ( '-1' == response ) {

            // Invalid nonce
            Tailor.Notify( window._l10n.invalid );
        }
        else {

            // General error condition
            Tailor.Notify( window._l10n.error );
        }
    }
};

module.exports = Ajax;
},{}],77:[function(require,module,exports){
/**
 * Tailor.Notify
 *
 * Notification class for presenting simple messages to the end user.
 *
 * @class
 */
var Notification;

require( './polyfills/transitions' );

Notification = function( options ) {
    this.options = _.extend( {}, this.defaults, options );
    this.el = document.createElement( 'div' );
    this.el.className = 'notification notification--' + this.options.type;
    this.container = document.getElementById( 'tailor-notification-container' ) || document.body;

    this.initialize();
};

Notification.prototype = {

    defaults : {
        message : '',
        type : '',
        ttl : 3000,

        onShow: function () {},
        onHide: function () {}
    },

	/**
	 * Initializes the notification.
	 *
	 * @since 1.0.0
	 */
	initialize : function() {
        this.el.innerHTML = this.options.message;
        this.container.insertBefore( this.el, this.container.firstChild );
    },

	/**
	 * Shows the notification.
	 *
	 * @since 1.0.0
	 */
    show : function() {
        var notification = this;
        notification.el.classList.add( 'is-visible' );

        if ( 'function' == typeof notification.options.onShow ) {
            notification.options.onShow.call( notification );
        }

        notification.session = setTimeout( function() {
            notification.hide();
        }, notification.options.ttl );
    },

    /**
     * Hides the notification.
     *
     * @since 1.0.0
     */
    hide : function() {

        var obj = this;

        var onTransitionEnd = function( e ) {

            if ( Modernizr.cssanimations ) {
                if ( e.target !== obj.el ) {
                    return false;
                }
                obj.el.removeEventListener( window.transitionEndName, onTransitionEnd );
            }

            obj.container.removeChild( obj.el );

            if ( 'function' == typeof obj.options.onShow ) {
                obj.options.onShow.call( obj );
            }
        };

        clearTimeout( obj.session );

        if ( Modernizr.csstransitions ) {
            obj.el.addEventListener( window.transitionEndName, onTransitionEnd );
            obj.el.classList.remove( 'is-visible' );
        }
        else {
            onTransitionEnd();
        }
    }
};

/**
 * Creates a new notification.
 *
 * @since 1.0.0
 *
 * @param msg
 * @param type
 */
var notify = function( msg, type ) {

    var notification = new Notification( {
        message : msg,
        type : type || 'error'
    } );

    notification.show();
};

module.exports = notify;
},{"./polyfills/transitions":80}],78:[function(require,module,exports){
/**
 * classList Polyfill
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 */
( function() {

	if ( 'undefined' === typeof window.Element || 'classList' in document.documentElement ) {
		return;
	}

	var prototype = Array.prototype,
		push = prototype.push,
		splice = prototype.splice,
		join = prototype.join;

	function DOMTokenList( el ) {
		this.el = el;
		var classes = el.className.replace( /^\s+|\s+$/g, '' ).split( /\s+/ );
		for ( var i = 0; i < classes.length; i++ ) {
			push.call( this, classes[ i ] );
		}
	}

	DOMTokenList.prototype = {

		add: function( token ) {
			if ( this.contains( token ) ) {
				return;
			}
			push.call( this, token );
			this.el.className = this.toString();
		},

		contains: function( token ) {
			return this.el.className.indexOf( token ) != -1;
		},

		item: function( index ) {
			return this[ index ] || null;
		},

		remove: function( token ) {
			if ( ! this.contains( token ) ) {
				return;
			}
			for ( var i = 0; i < this.length; i++ ) {
				if ( this[ i ] == token ) {
					break;
				}
			}
			splice.call( this, i, 1 );
			this.el.className = this.toString();
		},

		toString: function() {
			return join.call( this, ' ' );
		},

		toggle: function( token ) {
			if ( ! this.contains( token ) ) {
				this.add( token );
			}
			else {
				this.remove( token );
			}
			return this.contains( token );
		}
	};

	window.DOMTokenList = DOMTokenList;

	function defineElementGetter( obj, prop, getter ) {
		if ( Object.defineProperty ) {
			Object.defineProperty( obj, prop, {
				get : getter
			} );
		}
		else {
			obj.__defineGetter__( prop, getter );
		}
	}

	defineElementGetter( Element.prototype, 'classList', function() {
		return new DOMTokenList( this );
	} );

} )();
},{}],79:[function(require,module,exports){
/**
 * requestAnimationFrame polyfill.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
( function( window ) {

	'use strict';

	var lastTime = 0,
		vendors = [ 'ms', 'moz', 'webkit', 'o' ];

	for ( var x = 0; x < vendors.length && ! window.requestAnimationFrame; ++x ) {
		window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
		window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
	}

	if ( ! window.requestAnimationFrame ) {
		window.requestAnimationFrame = function( callback, el ) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() {
					callback( currTime + timeToCall );
				},
				timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if ( ! window.cancelAnimationFrame ) {
		window.cancelAnimationFrame = function( id ) {
			clearTimeout( id );
		};
	}

} ) ( window );
},{}],80:[function(require,module,exports){
/**
 * Makes animation and transition support status and end names available as global variables.
 */
( function( window ) {

    'use strict';

    var el = document.createElement( 'fakeelement' );

    function getAnimationEvent(){
        var t,
            animations = {
                'animation' : 'animationend',
                'OAnimation' : 'oAnimationEnd',
                'MozAnimation' : 'animationend',
                'WebkitAnimation' : 'webkitAnimationEnd'
            };

        for ( t in animations ) {
            if ( animations.hasOwnProperty( t ) && 'undefined' !== typeof el.style[ t ] ) {
                return animations[ t ];
            }
        }

        return false;
    }

    function getTransitionEvent(){
        var t,
            transitions = {
                'transition' : 'transitionend',
                'OTransition' : 'oTransitionEnd',
                'MozTransition' : 'transitionend',
                'WebkitTransition' : 'webkitTransitionEnd'
            };

        for ( t in transitions ) {
            if ( transitions.hasOwnProperty( t ) && 'undefined' !== typeof el.style[ t ] ) {
                return transitions[ t ];
            }
        }

        return false;
    }

    window.animationEndName = getAnimationEvent();
    window.transitionEndName = getTransitionEvent();

} ) ( window );
},{}]},{},[75]);

var ResizableBehavior = Marionette.Behavior.extend( {

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
        if (
            edges.length &&
            ! this.$container.hasClass( 'is-full-screen' ) &&
            ! document.body.classList.contains( 'mce-fullscreen' )
        ) {
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

module.exports = ResizableBehavior;
<?php

/**
 * Filesystem helper functions.
 *
 * @package Tailor
 * @subpackage Helpers
 * @since 1.0.0
 */

if ( ! function_exists( 'tailor_create_dir' ) ) {

    /**
     * Creates a directory in the given location.
     *
     * @since 1.0.0
     *
     * @param string $path
     * @return bool
     */
    function tailor_create_dir( &$path ) {
        $created = wp_mkdir_p( trailingslashit( $path ) );
        @chmod( $path, 0777 );

        $index_file = trailingslashit( $path ) . 'index.php';
        if ( ! file_exists( $index_file ) ) {
            tailor_create_file( $index_file, "<?php\r\n// Silence is golden." );
        }

        return $created;
    }
}

if ( ! function_exists( 'tailor_remove_dir' ) ) {

	/**
	 * Removes a directory and all files contained within it.
	 *
	 * @since 1.0.0
	 *
	 * @param $dir
	 */
	function tailor_remove_dir( $dir ) {
		if ( is_dir( $dir ) ) {
			$objects = scandir( $dir );
			foreach ( $objects as $object ) {
				if ( $object != "." && $object != ".." ) {
					$path = $dir . "/" . $object;
					if ( filetype( $path ) == "dir" ) {
						tailor_remove_dir( $path );
					}
					else {
						unlink( $path );
					}
				}
			}
			reset( $objects );
			rmdir( $dir );
		}
	}
}

if ( ! function_exists( 'tailor_create_file' ) ) {

    /**
     * Creates a file in a given directory with the given content.
     *
     * @since 1.0.0
     *
     * @param string $file_path
     * @param string $content
     * @return bool
     */
    function tailor_create_file( $file_path, $content = '' ) {

        $fp = @fopen( $file_path, 'w' );

        if( $fp ) {
            fwrite( $fp, $content );
            fclose( $fp );
            $fp = fopen( $file_path, "r" );
            $file_content = fread( $fp, filesize( $file_path ) );
            $created = ( $file_content == $content );
            fclose( $fp );
        }
        else {
            $created  = false;
        }

        return false !== $created;
    }
}

if ( ! function_exists( 'tailor_upload_dir' ) ) {

	/**
	 * Returns an array containing the current upload directory's path and url.
	 *
	 * Corrects for wp_upload_dir() not supporting SSL.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	function tailor_upload_dir() {
		$wp_upload_dir = wp_upload_dir();
		if ( tailor_is_ssl() ) {
			$wp_info['baseurl'] = str_ireplace( 'http://', 'https://', $wp_upload_dir['baseurl'] );
		}
		return $wp_upload_dir;
	}
}
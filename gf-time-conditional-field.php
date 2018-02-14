<?php
namespace Idearia\Gf_Time_Conditional_Field;
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.idearia.it/
 * @since             1.0.0
 * @package           GF_Time_Conditional_Field
 *
 * @wordpress-plugin
 * Plugin Name:       GF Time Coditional Field
 * Plugin URI:        https://www.idearia.it/
 * Description:       Based on the selected date, you can output different times in the select
 * Version:           1.0.0
 * Author:            Idearia Srl
 * Author URI:        https://www.idearia.it/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       gf-time-conditional-field
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently pligin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define(  __NAMESPACE__ . 'PLUGIN_VERSION', '1.0.0' );
define(  __NAMESPACE__ . 'TEXT_DOMAIN', 'gf-time-conditional-field' );
define(  __NAMESPACE__ . 'PLUGIN_FILENAME', __FILE__ );


// class that handle the filter for writing data from the displayed field to the hidden one.
// require_once plugin_dir_path( __FILE__ ) . 'includes/class-gf-conditional-field-filter.php';


class GF_Time_Conditional_Field {

	protected $ids_array = [];
	protected $version;

	public function admin_enqueue_scripts() {
		wp_enqueue_script( __NAMESPACE__ . 'custom', plugin_dir_url( __FILE__ ) . 'assets/js/custom.min.js', array( 'jquery' ), $this->version, true );
	}

	public function __construct() {
		//
		$this->version = constant( __NAMESPACE__ . 'PLUGIN_VERSION' );
	}

	public function run($args = []) {

		add_action( 'wp_enqueue_scripts', [$this, 'admin_enqueue_scripts'] );

		// if( !is_array( $this->ids_array ) ) {
		// 	return new \WP_Error( 'GF_Conditional_Field_Idearia', __FILE__.':'.__LINE__.' '.__( 'Failed to initialize the gform_pre_submission_$id', constant( __NAMESPACE__ . 'TEXT_DOMAIN' ) ) );
		// }
		//
		// foreach( $this->ids_array as $id ) {
		// 	add_action( 'gform_pre_submission_'.$id, '\Idearia\Gf_Conditional_Field\pre_submission_day_exception_handler' );
		// }

	}
}


$gf_conditional_field = new GF_Time_Conditional_Field;
$return = $gf_conditional_field->run();

if( is_wp_error( $return ) ) {
	error_log($return->get_error_message());
	// echo $return->get_error_message();
}

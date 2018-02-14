<?php
namespace Idearia\Gf_Conditional_Field;

class GF_Conditional_Field_Filter {

	// Field where the output will be written
	protected $output_field = 'time';

	// Field that determines what field is considered
	protected $control_field = 'date';

	protected $date_format = 'd/m/Y';

	/**
	 * Given a Gravity Form object and an array of admin labels,
	 * return an array with the corresponding IDs.
	 */
	protected function gform_ids_from_admin_labels( array $admin_labels, $form ) {

		/* Initialize output */
		$ids_array = [];

		/* Find ids of the corresponding fields */
		foreach ( $form['fields'] as $field ) {

			if ( in_array( $field['adminLabel'], $admin_labels ) ) {

				$ids_array[ $field['adminLabel'] ] = $field['id'];

			}
		}

		return $ids_array;

	}

	 /**
	 * We are passing the value from a datepicker field
	 * and converting it to date time.
	 *
	 * From its timeStamp we get the number of the day of the week
	 * (0 if is sunday, 1 if is monday, 6 if is saturday)
	 *
	 * Monday		1
	 * Tuesday		2
	 * Wednesday	3
	 * Thursday		4
	 * Friday		5
	 * Saturday		6
	 * Sunday		0
	 * Return false on error (wrong date, wrong format...)
	 */
	public static function dayWeekFromDateField ( $date, $format='d/m/Y' ) {

		$myDateTime = DateTime::createFromFormat( $format, $date );

		if ( false === $myDateTime ) {
			error_log( "Could not convert date '$date' to datetime object with format '$format'" );
			return false;
		}

		$dayWeek = date( 'w', $myDateTime->getTimestamp() );

		/* Debug */
		// error_log( "DAY OF WEEK = ". $this->dayWeekFromDateField(( $control_value, $this->date_format ) );

		return $dayWeek;
	}



	/**
	* Find select fields with specific admin labels.
	* Fill the final hidden field ($output_field) with the select that was active
	*/

	public function pre_submission_day_exception_handler( $form ) {
		/* Field where the output will be written */
		// $output_field = 'time';

		/* Field that determines what field is considered */
		// $control_field = 'date';
		$date_format = $this->date_format;

		/* Get ID of the output field */
		$output_field_id = $this->gform_ids_from_admin_labels( array( $this->output_field ), $form );
		if ( ! is_array( $output_field_id ) || count( $output_field_id ) != 1 ) {
			// error_log("Could not find id of field with admin label '$this->output_field'");
			return;
		}
		$output_field_id = array_pop( $output_field_id );

		/* Get ID of the control field */
		$control_field_id = $this->gform_ids_from_admin_labels( array( $this->control_field ), $form );
		if ( ! is_array( $control_field_id ) || count( $control_field_id ) != 1 ) {
			// error_log("Could not find id of field with admin label '$this->control_field'");
			return;
		}
		$control_field_id = array_pop( $control_field_id );

		/* Get value of the control field */
		if ( ! isset( $_POST[ 'input_' . $control_field_id ] ) ) {
			// error_log("Could not find field with admin label '$this->control_field' in form submission");
			return;
		}
		$control_value = rgpost( 'input_' . $control_field_id );
		/* Fields to consider + corresponding conditions */
		$switch_fields = [
			'time_only_monday' => function( $control_value ) {
				return ( GF_Conditional_Field_Filter::dayWeekFromDateField( $control_value, $this->date_format ) == 1 );
			}
			// 'from_tu_to_th' => function( $control_value ) use ( $date_format ) {
			// 	return ( $this->dayWeekFromDateField(( $control_value, $date_format ) >= 2  && $this->dayWeekFromDateField(( $control_value, $date_format ) <= 4 );
			// },
			// 'from_fr_to_su' => function( $control_value ) use ( $date_format ) {
			// 	return ( ( $this->dayWeekFromDateField(( $control_value, $date_format ) >= 5 && $this->dayWeekFromDateField(( $control_value, $date_format ) <= 6 ) || $this->dayWeekFromDateField(( $control_value, $date_format ) == 0 );
			// },
			// 'time_only_lunch' => function( $control_value ) use ( $date_format ) {
			// 	return ( preg_match( '/^24[\/-]12[\/-]2017|2017[\/-]12[\/-]24$/', $control_value ) );
			// },
			// 'time_lunch_dinner' => function( $control_value ) use ( $date_format ) {
			// 	return ( $this->dayWeekFromDateField(( $control_value, $date_format ) == 6 || preg_match( '/^0?4[\/-]0?1[\/-]2018|2018[\/-]0?1[\/-]0?4$/', $control_value ) || preg_match( '/^0?5[\/-]0?1[\/-]2018|2018[\/-]0?1[\/-]0?5$/', $control_value ) );
			// },
			// 'time_lunch_dinner_sun' => function( $control_value ) use ( $date_format ) {
			// 	return ( $this->dayWeekFromDateField(( $control_value, $date_format ) == 7 && ! preg_match( '/^24[\/-]12[\/-]2017|2017[\/-]12[\/-]24$/', $control_value ) );
			// }
		];

		/* Debug */
		// error_log( "OUTPUT FIELD ID = $output_field_id" );
		// error_log( "CONTROL FIELD ID = $control_field_id" );
		// error_log( "CONTROL VALUE = $control_value" );

		/* Set the output value to match the switch field that matches
		its condition. If multiple switch fields match their conditions,
		use the last one. */
		foreach ( $switch_fields as $admin_label => $condition ) {

			/* Get ID of the current switch field */
			$switch_field_id = $this->gform_ids_from_admin_labels( array( $admin_label ), $form );
			if ( ! is_array( $switch_field_id ) || count( $switch_field_id ) != 1 ) {
				// error_log("Could not find id of field with admin label '$admin_label'");
				return;
			}
			$switch_field_id = array_pop( $switch_field_id );

			/* Debug */
			// error_log( "SWITCH FIELD ID ($admin_label) = $switch_field_id" );

			/* Check the control value against the condition */
			if ( $condition( $control_value ) ) {

				/* Debug */
				// error_log( "  -> SWITCH FIELD '$admin_label' MATCHES CONDITION!" );

				/* Overwrite the output field */
				$_POST[ 'input_' . $output_field_id ] = rgpost( 'input_' . $switch_field_id );

			}
			else {
				/* Debug */
				// error_log( "  -> NO MATCH!" );
			}

			/* Clear the 'fake' fields */
			$_POST[ 'input_' . $switch_field_id ] = '';

		}

		/* Debug */
		// error_log( "OUTPUT FIELD SET TO " . rgpost( 'input_' . $output_field_id ) );

	}
}

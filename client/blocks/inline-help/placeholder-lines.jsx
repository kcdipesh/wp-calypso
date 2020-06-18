/**
 * External dependencies
 */
import React from 'react';
import { times } from 'lodash';

export default ( { lines = 4, className = 'inline-help__results-placeholder-item' } ) => (
	<ul className="inline-help__results-placeholder">
		{ times( lines, n => (
			<li key={ n } className={ className } />
		) ) }
	</ul>
);

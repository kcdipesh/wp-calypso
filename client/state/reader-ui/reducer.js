/**
 * Internal dependencies
 */
import { READER_VIEW_STREAM } from 'state/reader/action-types';
import sidebar from './sidebar/reducer';
import { combineReducers, withStorageKey } from 'state/utils';
import cardExpansions from './card-expansions/reducer';
import hasUnseenPosts from './seen-posts/reducer';

/*
 * Holds the last viewed stream for the purposes of keyboard navigation
 */
export const currentStream = ( state = null, action ) =>
	action && action.type === READER_VIEW_STREAM ? action.streamKey : state;

const combinedReducer = combineReducers( {
	sidebar,
	cardExpansions,
	currentStream,
	hasUnseenPosts,
} );

export default withStorageKey( 'readerUi', combinedReducer );

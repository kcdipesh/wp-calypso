/**
 * External dependencies
 */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelect, useDispatch } from '@wordpress/data';
import { useI18n } from '@automattic/react-i18n';
import PlansGrid from '@automattic/plans-grid';
import type { Plans } from '@automattic/data-stores';

/**
 * Internal dependencies
 */
import { useSelectedPlan } from '../../hooks/use-selected-plan';
import { useTrackStep } from '../../hooks/use-track-step';
import useStepNavigation from '../../hooks/use-step-navigation';
import { STORE_KEY as ONBOARD_STORE } from '../../stores/onboard';
import { PLANS_STORE } from '../../stores/plans';
import ActionButtons, { BackButton } from '../../components/action-buttons';
import { Title, SubTitle } from '../../components/titles';
import { Step, usePath } from '../../path';
import { useFreeDomainSuggestion } from '../../hooks/use-free-domain-suggestion';

type PlanSlug = Plans.PlanSlug;

interface Props {
	isModal?: boolean;
}

const PlansStep: React.FunctionComponent< Props > = ( { isModal } ) => {
	const { __ } = useI18n();
	const history = useHistory();
	const makePath = usePath();
	const { goBack, goNext } = useStepNavigation();

	const plan = useSelectedPlan();
	const domain = useSelect( ( select ) => select( ONBOARD_STORE ).getSelectedDomain() );
	const isPlanFree = useSelect( ( select ) => select( PLANS_STORE ).isPlanFree );

	//@TODO: do the same for domains step
	const { setDomain, setHasUsedPlansStep } = useDispatch( ONBOARD_STORE );
	React.useEffect( () => {
		! isModal && setHasUsedPlansStep( true );
	}, [] );

	// Keep a copy of the selected plan locally so it's available when the component is unmounting
	const selectedPlanRef = React.useRef< string | undefined >();
	React.useEffect( () => {
		selectedPlanRef.current = plan?.storeSlug;
	}, [ plan ] );

	useTrackStep( isModal ? 'PlansModal' : 'Plans', () => ( {
		selected_plan: selectedPlanRef.current,
	} ) );

	const freeDomainSuggestion = useFreeDomainSuggestion();

	const handleBack = () => ( isModal ? history.goBack() : goBack() );
	const handlePlanSelect = ( planSlug: PlanSlug ) => {
		if ( isPlanFree( planSlug ) ) {
			setDomain( freeDomainSuggestion );
		}

		if ( isModal ) {
			history.goBack();
		} else {
			goNext();
		}
	};
	const handlePickDomain = () => history.push( makePath( Step.DomainsModal ) );

	const header = (
		<>
			<div>
				<Title>{ __( 'Choose a plan' ) }</Title>
				<SubTitle>
					{ __(
						'Pick a plan that’s right for you. Switch plans as your needs change. There’s no risk, you can cancel for a full refund within 30 days.'
					) }
				</SubTitle>
			</div>
			<ActionButtons>
				<BackButton onClick={ handleBack } />
			</ActionButtons>
		</>
	);

	return (
		<div className="gutenboarding-page plans">
			<PlansGrid
				header={ header }
				currentDomain={ domain }
				onPlanSelect={ handlePlanSelect }
				onPickDomainClick={ handlePickDomain }
			/>
		</div>
	);
};

export default PlansStep;

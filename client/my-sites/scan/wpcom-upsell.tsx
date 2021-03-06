/**
 * External dependencies
 */
import React, { ReactElement } from 'react';
import { translate } from 'i18n-calypso';
import { useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import DocumentHead from 'components/data/document-head';
import Main from 'components/main';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import { isPersonalPlan, isPremiumPlan } from 'lib/plans';
import FormattedHeader from 'components/formatted-header';
import PromoSection, { Props as PromoSectionProps } from 'components/promo-section';
import PromoCard from 'components/promo-section/promo-card';
import PromoCardCTA from 'components/promo-section/promo-card/cta';
import useTrackCallback from 'lib/jetpack/use-track-callback';
import Gridicon from 'components/gridicon';
import { getSitePlan } from 'state/sites/selectors';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';
import WhatIsJetpack from 'components/jetpack/what-is-jetpack';

/**
 * Asset dependencies
 */
import JetpackScanSVG from 'assets/images/illustrations/jetpack-scan.svg';
import './style.scss';

const promos = [
	{
		title: translate( 'Jetpack Backup' ),
		body: translate(
			'Granular control over your site, with the ability ' +
				'to restore it to any previous state, and export it at any time.'
		),
		image: <Gridicon icon="cloud-upload" className="scan__upsell-icon" />,
	},
	{
		title: translate( 'Activity Log' ),
		body: translate(
			'A complete record of everything that happens on your site, with history that spans over 30 days.'
		),
		image: <Gridicon icon="history" className="scan__upsell-icon" />,
	},
];

export default function WPCOMScanUpsellPage(): ReactElement {
	const onUpgradeClick = useTrackCallback( undefined, 'calypso_jetpack_scan_business_upsell' );
	const siteSlug = useSelector( getSelectedSiteSlug );
	const siteId = useSelector( getSelectedSiteId );
	const { product_slug: planSlug } = useSelector( ( state ) => getSitePlan( state, siteId ) );

	// Don't show the Activity Log promo for Personal or Premium plan owners.
	const filteredPromos: PromoSectionProps = React.useMemo( () => {
		if ( isPersonalPlan( planSlug ) || isPremiumPlan( planSlug ) ) {
			return { promos: [ promos[ 0 ] ] };
		}
		return { promos };
	}, [ planSlug ] );

	return (
		<Main className="scan__main scan__wpcom-upsell">
			<DocumentHead title="Scanner" />
			<SidebarNavigation />
			<PageViewTracker path="/scan/:site" title="Scanner" />

			<FormattedHeader
				headerText={ translate( 'Jetpack Scan' ) }
				id="scan-header"
				align="left"
				brandFont
			/>

			<PromoCard
				title={ translate( 'We guard your site. You run your business.' ) }
				image={ { path: JetpackScanSVG } }
				isPrimary
			>
				<p>
					{ translate(
						'Scan gives you automated scanning and one-click fixes ' +
							'to keep your site ahead of security threats.'
					) }
				</p>
				<PromoCardCTA
					cta={ {
						text: translate( 'Upgrade to Business Plan' ),
						action: {
							url: `/checkout/${ siteSlug }/business`,
							onClick: onUpgradeClick,
							selfTarget: true,
						},
					} }
				/>
			</PromoCard>

			<h2 className="scan__subheader">{ translate( 'Also included in the Business Plan' ) }</h2>

			<PromoSection { ...filteredPromos } />

			<WhatIsJetpack />
		</Main>
	);
}

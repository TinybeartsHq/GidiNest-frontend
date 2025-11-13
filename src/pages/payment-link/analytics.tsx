import { Helmet } from 'react-helmet-async';

import AnalyticsView from '../../sections/payment-link/view/analytics-view';

export default function AnalyticsPage() {
  return (
    <>
      <Helmet>
        <title>Payment Link Analytics | GidiNest</title>
      </Helmet>

      <AnalyticsView />
    </>
  );
}

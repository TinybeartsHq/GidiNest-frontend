import { Helmet } from 'react-helmet-async';

import PublicPaymentLinkView from '../../sections/payment-link/view/public-payment-link-view';

export default function PublicPaymentLinkPage() {
  return (
    <>
      <Helmet>
        <title>Payment Link | GidiNest</title>
      </Helmet>

      <PublicPaymentLinkView />
    </>
  );
}

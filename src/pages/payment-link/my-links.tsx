import { Helmet } from 'react-helmet-async';

import MyLinksView from '../../sections/payment-link/view/my-links-view';

export default function MyLinksPage() {
  return (
    <>
      <Helmet>
        <title>My Payment Links | GidiNest</title>
      </Helmet>

      <MyLinksView />
    </>
  );
}

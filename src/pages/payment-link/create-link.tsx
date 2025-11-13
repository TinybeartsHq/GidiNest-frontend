import { Helmet } from 'react-helmet-async';

import CreateLinkView from '../../sections/payment-link/view/create-link-view';

export default function CreateLinkPage() {
  return (
    <>
      <Helmet>
        <title>Create Payment Link | GidiNest</title>
      </Helmet>

      <CreateLinkView />
    </>
  );
}

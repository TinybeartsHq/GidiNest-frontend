import { Helmet } from 'react-helmet-async';

import EditLinkView from '../../sections/payment-link/view/edit-link-view';

export default function EditLinkPage() {
  return (
    <>
      <Helmet>
        <title>Edit Payment Link | GidiNest</title>
      </Helmet>

      <EditLinkView />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { LandingView } from 'src/sections/landing/landing-view';

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>GidiNest — Gift with Love, Welcome with Joy</title>
        <meta
          name="description"
          content="GidiNest is the easiest way for family and friends to send baby gifts in Nigeria. No bank transfers, no reference codes — just love, delivered."
        />
      </Helmet>
      <LandingView />
    </>
  );
}

import { useEffect } from 'react';

import { LandingView } from 'src/sections/landing/landing-view';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'GidiNest — Gift with Love, Welcome with Joy';
  }, []);

  return <LandingView />;
}

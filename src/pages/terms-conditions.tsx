import { CONFIG } from 'src/config-global';

import { TermsConditionsView } from 'src/sections/legal';

export default function Page() {
  return (
    <>
      <title>{`Terms and Conditions - ${CONFIG.appName}`}</title>

      <TermsConditionsView />
    </>
  );
}


import { CONFIG } from 'src/config-global';

import { EmailActivationView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Email Activiation - ${CONFIG.appName}`}</title>

      <EmailActivationView />
    </>
  );
}

import { CONFIG } from 'src/config-global';

import { SavingsView } from 'src/sections/savings/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Savings - ${CONFIG.appName}`}</title>

      <SavingsView />
    </>
  );
}

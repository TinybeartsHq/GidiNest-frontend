import { SingleSavingsGoalView } from 'src/routes/sections';

import { CONFIG } from 'src/config-global';
 

export default function Page() {
  return (
    <>
      <title>{`Savings - ${CONFIG.appName}`}</title>

<SingleSavingsGoalView />
    </>
  );
}

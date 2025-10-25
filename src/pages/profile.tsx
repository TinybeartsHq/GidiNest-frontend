import { CONFIG } from 'src/config-global';

import { UserProfileView } from 'src/sections/profile';

export default function Page() {
  return (
    <>
      <title>{`Profile - ${CONFIG.appName}`}</title>

      <UserProfileView />
    </>
  );
}

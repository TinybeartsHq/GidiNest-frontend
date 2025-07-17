import { CONFIG } from 'src/config-global';

import { CommunityPostDetailView } from 'src/sections/community/view';

 
export default function Page() {
  return (
    <>
      <title>{`Community - ${CONFIG.appName}`}</title>

          <CommunityPostDetailView />
    </>
  );
}

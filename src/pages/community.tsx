import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { CommunityView } from 'src/sections/community/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Community - ${CONFIG.appName}`}</title>

      <CommunityView communityPosts={_posts} />
    </>
  );
}

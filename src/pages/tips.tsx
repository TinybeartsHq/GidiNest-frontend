import { CONFIG } from 'src/config-global';

import { TipsView } from 'src/sections/tips';


export default function Page() {
  return (
    <>
      <title>{`Tips and FAQ - ${CONFIG.appName}`}</title>

      <TipsView />
    </>
  );
}

import type { FC } from 'react';

import { Box } from './Box';
import { Dustbin } from './Dustbin';

export const Container: FC = () => (
  <div className="flex flex-row">
    <div className="flex flex-col">
      <Box name="Glass" />
      <Box name="Banana" />
      <Box name="Paper" />
    </div>
    <div>
      <Dustbin allowedDropEffect="any" />
      <Dustbin allowedDropEffect="copy" />
      <Dustbin allowedDropEffect="move" />
    </div>
  </div>
);

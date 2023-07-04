import type { FC } from 'react';

import { DragItem } from './DragItem';
import { DropTarget } from './DropTarget';

export const Container: FC = () => (
  <div className="flex flex-row">
    <div className="flex flex-col bg-yellow-100">
      <DragItem name="Glass" />
      <DragItem name="Banana" />
      <DragItem name="Paper" />
    </div>
    <div>
      <DropTarget allowedDropEffect="any" />
      <DropTarget allowedDropEffect="copy" />
      <DropTarget allowedDropEffect="move" />
    </div>
  </div>
);

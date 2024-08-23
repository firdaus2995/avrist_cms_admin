import { FC, useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

export interface DustbinProps {
  allowedDropEffect: string;
}

function selectBackgroundColor(isActive: boolean, canDrop: boolean) {
  if (isActive) {
    return 'bg-blue-500';
  } else if (canDrop) {
    return 'bg-yellow-500';
  } else {
    return 'bg-gray-800';
  }
}

export const DropTarget: FC<DustbinProps> = ({ allowedDropEffect }) => {
  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop: (item: any) => {
        const droppedItemName = item.name;
        setDroppedItems((prevItems) => [...prevItems, droppedItemName]);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  const isActive = canDrop && isOver;
  const backgroundColor = selectBackgroundColor(isActive, canDrop);

  return (
    <div
      ref={drop}
      className={`h-48 w-48 m-6 ${backgroundColor} text-white p-4 text-center text-sm leading-normal float-left`}
    >
      {`Works with ${allowedDropEffect} drop effect`}
      <br />
      <br />
      {isActive ? 'Release to drop' : 'Drag a box here'}
      <br />
      <br />
      <div>Dropped Items:</div>
      <ul>
        {droppedItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

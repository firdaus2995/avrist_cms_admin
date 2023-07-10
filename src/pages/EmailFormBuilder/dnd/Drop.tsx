import React from "react";
import { useDrop } from "react-dnd";

interface IDrop {
  children: React.ReactNode;
  onDropped: (item: any) => void;
};

const Drop: React.FC<IDrop> = ({
  children,
  onDropped,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'COMPONENT',
      drop: (item: any) => {
        onDropped(item);
      },
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      })
    })
  )

  const backgroundColorGenerator = () => {
    if (canDrop && isOver) {
      return 'border-[1px] border-dashed border-purple bg-lavender'
    } else if (canDrop) {
      return 'border-[1px] border-dashed border-light-grey bg-light-purple-2'
    } else {
      return 'border-[1px] border-transparent'
    }
  }

  return (
    <div
      ref={drop}
      className={`h-full flex flex-col gap-3 overflow-auto p-2 ${backgroundColorGenerator()}`}
    >
      {children}
    </div>
  )
}

export default Drop;

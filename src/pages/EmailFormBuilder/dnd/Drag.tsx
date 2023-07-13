import React from "react";
import { useDrag } from "react-dnd";

interface IDrag {
  name: string;
  children: React.ReactNode;
};

const Drag: React.FC<IDrag> = ({
  name,
  children,
}) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: 'COMPONENT',
      item: { name },
      collect: (monitor: any) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    })
  )

  return (
    <div
      ref={drag}
      style={{ opacity }}
      className="cursor-grab"
    >
      {children}
    </div>
  )
}

export default Drag;

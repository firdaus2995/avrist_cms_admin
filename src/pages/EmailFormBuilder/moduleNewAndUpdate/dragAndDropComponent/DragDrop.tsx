import React, { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface IDragDrop {
  children: any;
  index: number;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
};

const DragDrop: React.FC<IDragDrop> = ({
  children,
  index,
  moveComponent,
}) => {
  const ref: any = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'PREVIEW_COMPONENT',
    collect(monitor: any) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor: any) {
      if (!ref.current) {
        return;
      };

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      };

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      };
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      };

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'PREVIEW_COMPONENT',
    item: () => {
      return { index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  useEffect(() => {
    console.log(index);
  }, [index]);

  return (
    <div 
      ref={ref}
      data-handler-id={handlerId}
      style={{
        cursor: 'move',
        opacity,
      }}
    >
      {children}
    </div>
  )
};

export default DragDrop;

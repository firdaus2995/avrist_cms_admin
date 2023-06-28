import { SetStateAction, useState } from 'react';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { ISortableTree } from './types';
import TreeTheme from "react-sortable-tree-theme-full-node-drag";
import "./style.css";
import DotsThreeCircle from "@/assets/dots-three-circle.svg";

<style>.button {}</style>;

export default function SortableTreeComponent(props: ISortableTree) {
  const { data, onChange, onClick } = props;
  const [treeData, setTreeData] = useState(data);

  function updateTreeData(treeData: SetStateAction<any[]>) {
    setTreeData(treeData);
  }

  return (
    <div className="mt-10">
      <div className="w-full py-10 h-[50vh] overflow-auto">
        <SortableTree
          theme={TreeTheme}
          treeData={treeData}
          onChange={treeData => {
            updateTreeData(treeData);
            onChange(treeData);
          }}
          canDrag={({ node }) => !node.noDragging}
          maxDepth={3}
          generateNodeProps={rowInfo => ({
            // subtitle: rowInfo.node.subTitle,
            title: rowInfo.node.label,
            children: rowInfo.node.child,
            buttons: [
              <div key={1}>
                <div className='p-2'>
                  <img src={DotsThreeCircle} 
                    className='w-[24px] h-[24px]'
                    onClick={() => {
                      onClick(rowInfo);
                    }}
                  />
                </div>
              </div>,
            ],
            style: {
              height: '100%',
              width: '80vh',
            },
          })}
        />
      </div>
    </div>
  );
}

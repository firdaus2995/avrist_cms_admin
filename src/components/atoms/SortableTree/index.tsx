import { useState } from 'react';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { ISortableTree } from './types';
import TreeTheme from "react-sortable-tree-theme-full-node-drag";
import "./style.css";
import DotsThreeCircle from "@/assets/dots-three-circle.svg";

<style>.button {}</style>;

export default function SortableTreeComponent(props: ISortableTree) {
  const { data, onChange, onClick } = props;
  const [treeData, setTreeData] = useState(() => {
    if (data.length > 0) {
      const treeDataNew = data.map((node: any) => ({
        ...node,
        expanded: true,
      }))
      return treeDataNew;
    } else {
      return []
    }
  });

  function updateTreeData(treeData: any) {
    setTreeData(treeData);
  }

  return (
    <div className="mt-10">
      <div className="w-full h-[50vh] overflow-auto">
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
                    className='w-[24px] h-[24px] cursor-pointer'
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

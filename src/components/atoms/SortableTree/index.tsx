import { SetStateAction, useState } from 'react';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { ISortableTree } from './types';

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
          treeData={treeData}
          onChange={treeData => {
            updateTreeData(treeData);
            onChange(treeData);
          }}
          canDrag={({ node }) => !node.dragDisabled}
          maxDepth={3}
          generateNodeProps={rowInfo => ({
            // title: rowInfo.node.label,
            // subtitle: rowInfo.node.subTitle,
            children: rowInfo.node.child,
            buttons: [
              <div key={1}>
                <div className='p-2'>
                  <svg 
                    role='button'
                    onClick={() => { onClick(rowInfo); }}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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

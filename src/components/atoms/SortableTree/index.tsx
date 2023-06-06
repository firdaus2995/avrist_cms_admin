/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { SetStateAction, useState } from 'react';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { ISortableTree } from './types';

<style>.button {}</style>;

export default function SortableTreeComponent(props: ISortableTree) {
  const { data, onChange } = props;
  const [treeData, setTreeData] = useState(data);

  function updateTreeData(treeData: SetStateAction<any[]>) {
    setTreeData(treeData);
  }

  const alertNodeInfo = (rowInfo: { node: any; path: any; treeIndex: any; lowerSiblingCounts?: number[]; isSearchMatch?: boolean; isSearchFocus?: boolean; }) => {
    const objectString = Object.keys(rowInfo.node)
      .map(k => (k === 'children' ? 'children: Array' : `${k}: '${rowInfo.node[k]}'`))
      .join(',\n   ');

    alert(
      'Info passed to the icon and button generators:\n\n' +
        `node: {\n   ${objectString}\n},\n` +
        `path: [${rowInfo.path.join(', ')}],\n` +
        `treeIndex: ${rowInfo.treeIndex}`,
    );
  };




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
          // canDrop={({ nextParent,nextPath }) =>(!nextParent?.noChildren) && nextPath.length>1 }
          generateNodeProps={rowInfo => ({
            // title: rowInfo.node.label,
            // subtitle: rowInfo.node.subTitle,
            buttons: [
              <div key={1}>
                <button
                  className="btn btn-active btn-ghost btn-xs m-2"
                  onClick={_event => {
                    alertNodeInfo(rowInfo);
                  }}>
                  Info
                </button>
              </div>,
            ],
            style: {
              height: '50px',
              width: '80vh',
            },
          })}
        />
      </div>
    </div>
  );
}

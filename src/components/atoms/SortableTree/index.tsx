/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useRef, useState } from 'react';
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { ISortableTree } from './types';

<style>.button {}</style>;

export default function SortableTreeComponent(props: ISortableTree) {
  const { data, onChange } = props;
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(null);
  const [treeData, setTreeData] = useState(data);

  const inputEl = useRef();

  function createNode() {
    const value = inputEl.current.value;

    if (value === '') {
      inputEl.current.focus();
      return;
    }

    const newTree = addNodeUnderParent({
      treeData,
      parentKey: null,
      expandParent: true,
      getNodeKey,
      newNode: {
        id: '123',
        title: value,
      },
    });

    setTreeData(newTree.treeData);

    inputEl.current.value = '';
  }

  function updateNode(rowInfo) {
    const { node, path } = rowInfo;
    const { children } = node;

    const value = inputEl.current.value;

    if (value === '') {
      inputEl.current.focus();
      return;
    }

    const newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey,
      newNode: {
        children,
        title: value,
      },
    });

    setTreeData(newTree);

    inputEl.current.value = '';
  }

  function addNodeChild(rowInfo) {
    const { path } = rowInfo;

    const value = inputEl.current.value;
    // const value = inputEls.current[treeIndex].current.value;

    if (value === '') {
      inputEl.current.focus();
      // inputEls.current[treeIndex].current.focus();
      return;
    }

    const newTree = addNodeUnderParent({
      treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey,
      newNode: {
        title: value,
      },
    });

    setTreeData(newTree.treeData);

    inputEl.current.value = '';
    // inputEls.current[treeIndex].current.value = "";
  }

  function addNodeSibling(rowInfo) {
    const { path } = rowInfo;

    const value = inputEl.current.value;
    // const value = inputEls.current[treeIndex].current.value;

    if (value === '') {
      inputEl.current.focus();
      // inputEls.current[treeIndex].current.focus();
      return;
    }

    const newTree = addNodeUnderParent({
      treeData,
      parentKey: path[path.length - 2],
      expandParent: true,
      getNodeKey,
      newNode: {
        title: value,
      },
    });

    setTreeData(newTree.treeData);

    inputEl.current.value = '';
    // inputEls.current[treeIndex].current.value = "";
  }

  function removeNode(rowInfo) {
    const { path } = rowInfo;
    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey,
      }),
    );
  }

  function updateTreeData(treeData) {
    setTreeData(treeData);
  }

  function expand(expanded) {
    setTreeData(
      toggleExpandedForAll({
        treeData,
        expanded,
      }),
    );
  }

  function expandAll() {
    expand(true);
  }

  function collapseAll() {
    expand(false);
  }

  const alertNodeInfo = ({ node, path, treeIndex }) => {
    const objectString = Object.keys(node)
      .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
      .join(',\n   ');

    alert(
      'Info passed to the icon and button generators:\n\n' +
        `node: {\n   ${objectString}\n},\n` +
        `path: [${path.join(', ')}],\n` +
        `treeIndex: ${treeIndex}`,
    );
  };

  const selectPrevMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null
        ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
        : searchFoundCount - 1,
    );
  };

  const selectNextMatch = () => {
    setSearchFocusIndex(searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0);
  };

  const getNodeKey = ({ treeIndex }) => treeIndex;

  return (
    <div className="mt-10">
      <div className="w-full py-10 h-[50vh] overflow-auto">
        <SortableTree
          treeData={treeData}
          onChange={treeData => {
            updateTreeData(treeData);
            onChange(treeData);
          }}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          searchFinishCallback={matches => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
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
                  label="Alert"
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

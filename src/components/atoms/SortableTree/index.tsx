/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useRef, useState } from 'react';
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';

const seed = [
  {
    id: '123',
    title: 'Company',
    subtitle: 'zzz',
    isDirectory: true,
    expanded: true,
    children: [
      { id: '456', title: 'Human Resource', subtitle: 'zzz' },
      {
        id: '789',
        title: 'Bussiness',
        subtitle: 'zzz',
        expanded: true,
        children: [
          {
            id: '234',
            title: 'Store A',
            subtitle: 'zzz',
          },
          { id: '567', title: 'Store B', subtitle: 'zzz' },
        ],
      },
    ],
  },
];

<style>.button {}</style>;

export default function SortableTreeComponent() {
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(null);
  const [treeData, setTreeData] = useState(seed);

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
      <div style={{ flex: '0 0 auto', padding: '0 15px' }}>
        <input className="input input-bordered input-sm" ref={inputEl} type="text" />
        <br />
        <button className="btn btn-active btn-ghost btn-xs my-2" onClick={createNode}>
          Create Node
        </button>
        <br />
        <button className="btn btn-active btn-ghost btn-xs my-2" onClick={expandAll}>
          Expand All
        </button>
        <button className="btn btn-active btn-ghost btn-xs m-2" onClick={collapseAll}>
          Collapse All
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <form
          style={{ display: 'inline-block' }}
          onSubmit={event => {
            event.preventDefault();
          }}>
          <label htmlFor="find-box">
            Search:&nbsp;
            <input
              className="input input-bordered input-sm"
              id="find-box"
              type="text"
              value={searchString}
              onChange={event => {
                setSearchString(event.target.value);
              }}
            />
          </label>

          <button
            type="button"
            className="btn btn-active btn-ghost btn-xs m-1"
            disabled={!searchFoundCount}
            onClick={selectPrevMatch}>
            &lt;
          </button>

          <button
            type="submit"
            className="btn btn-active btn-ghost btn-xs m-1"
            disabled={!searchFoundCount}
            onClick={selectNextMatch}>
            &gt;
          </button>

          <span>
            &nbsp;
            {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
            &nbsp;/&nbsp;
            {searchFoundCount ?? 0}
          </span>
        </form>
      </div>

      <div className="w-full h-[70vh] overflow-auto">
        <SortableTree
          treeData={treeData}
          onChange={treeData => {
            updateTreeData(treeData);
          }}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          searchFinishCallback={matches => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
          }}
          canDrag={({ node }) => !node.dragDisabled}
          maxDepth={3}
          canDrop={({ nextParent,nextPath }) =>(!nextParent?.noChildren) && nextPath.length>1 }
          generateNodeProps={rowInfo => ({
            // title: rowInfo.node.label,
            // subtitle: rowInfo.node.subTitle,
            buttons: [
              <div key={1}>
                <button
                  label="Add Sibling"
                  className="btn btn-active btn-ghost btn-xs m-2"
                  onClick={_event => {
                    addNodeSibling(rowInfo);
                  }}>
                  Add Sibling
                </button>
                <button
                  label="Add Child"
                  className="btn btn-active btn-ghost btn-xs m-2"
                  onClick={_event => {
                    addNodeChild(rowInfo);
                  }}>
                  Add Child
                </button>
                <button
                  label="Update"
                  className="btn btn-active btn-ghost btn-xs m-2"
                  onClick={_event => {
                    updateNode(rowInfo);
                  }}>
                  Update
                </button>
                <button
                  label="Delete"
                  className="btn btn-active btn-ghost btn-xs m-2"
                  onClick={_event => {
                    removeNode(rowInfo);
                  }}>
                  Remove
                </button>
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
            },
          })}
        />
      </div>
    </div>
  );
}

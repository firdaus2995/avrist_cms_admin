import { useState, useRef, useEffect } from 'react';
import SortableTree, { getVisibleNodeCount } from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { ISortableTree } from './types';
import TreeTheme from 'react-sortable-tree-theme-full-node-drag';
import './style.css';
import DotsThreeCircle from '@/assets/dots-three-circle.svg';
import EditYellow from '@/assets/edit-yellow.svg';
import TakedownIcon from '@/assets/paper-x.svg';
import { t } from 'i18next';

<style>.button {}</style>;

export default function SortableTreeComponent(props: ISortableTree) {
  const { data, onChange, onClick } = props;
  const refParent: any = useRef(null);

  const [treeData, setTreeData] = useState(data ?? []);
  const [rowData, setRowData] = useState<any>(null);
  const [openMore, setOpenMore] = useState(false);
  const [action, setAction] = useState('');
  const [selectedTree, setSelectedTree] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [offsetTop, setOffsetTop] = useState(300);

  const count = getVisibleNodeCount({treeData})

  function updateTreeData(treeData: any) {
    setTreeData(treeData);
  }

  function getOffset(el: any) {
    const position = el.getBoundingClientRect();
    return {
      top: parseInt(position.top) + window.scrollY,
      left: parseInt(position.left) + window.scrollX,
    };
  }

  useEffect(() => {
    const handleOutsideClick = (e: any): void => {
      if (!refParent?.current?.contains(e.target)) {
        setOpenMore(false);
      }
    };

    if (openMore) {
      setAction('');
    }

    document.addEventListener('click', handleOutsideClick, false);
    return () => {
      document.removeEventListener('click', handleOutsideClick, false);
    };
  }, [openMore]);

  useEffect(() => {
    onClick(rowData, action);
  }, [action]);

  useEffect(() => {
    setTreeData(data);
  }, [JSON.stringify(data)]);

  const MoreIcon = () => {
    return (
      <div
        className="absolute bg-white rounded-xl border border-primary px-4 py-2 z-10"
        style={{ left: offsetLeft, top: offsetTop }}>
        <div className="flex flex-col gap-2 w-full">
          <button
            className="btn btn-outline text-xs btn-sm w-28 h-10 text-left"
            onClick={() => {
              setAction('EDIT');
            }}>
            <div className="w-full flex flex-row items-center gap-3">
              <img src={EditYellow} />
              {t('user.menu-list.menuList.edit')}
            </div>
          </button>
          <button
            className="btn btn-primary text-xs btn-sm w-28 h-10"
            onClick={() => {
              setAction('TAKEDOWN');
            }}>
            <div className="w-full flex flex-row items-center gap-3">
              <img src={TakedownIcon} />
              {t('user.menu-list.menuList.takedown')}
            </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-10" ref={refParent}>
      <div className="w-full" style={{height: count * 62}}>
        {openMore && MoreIcon()}
        <SortableTree
          theme={TreeTheme}
          treeData={treeData}
          onChange={treeData => {
            updateTreeData(treeData);
          }}
          onMoveNode={data => {
            onChange(data?.node, data?.treeData);
          }}
          canDrag={({ node }) => !node.noDragging}
          maxDepth={4}
          generateNodeProps={rowInfo => ({
            // subtitle: rowInfo.node.subTitle,
            title: rowInfo.node.label,
            children: rowInfo.node.child,
            buttons: [
              <div key={1}>
                <div className="p-2">
                  <img
                    id={rowInfo.treeIndex.toString()}
                    src={DotsThreeCircle}
                    className="w-[24px] h-[24px] cursor-pointer"
                    onClick={() => {
                      setRowData(rowInfo);
                      setOffsetLeft(
                        getOffset(document.getElementById(rowInfo.treeIndex.toString())).left - 408,
                      );
                      setOffsetTop(
                        getOffset(document.getElementById(rowInfo.treeIndex.toString())).top - 103,
                      );
                      setSelectedTree(rowInfo.treeIndex);

                      if (openMore && rowInfo.treeIndex === selectedTree) {
                        setOpenMore(false);
                      } else {
                        setOpenMore(true);
                      }
                    }}
                  />
                </div>
              </div>,
            ],
            style: {
              width: '50vw',
              minWidth: 300,
            },
          })}
        />
      </div>
    </div>
  );
}

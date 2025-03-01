import './style.css';

import React, { 
  Fragment,
} from 'react';
import { 
  Menu, 
  Transition,
} from '@headlessui/react';
import { 
  ChevronDownIcon, 
} from '@heroicons/react/20/solid';

import { 
  Pagination,
} from 'react-headless-pagination';
import CheckMark from '../../../assets/checkmark.png';
import countPage from '../../../utils/countPage';
import TableNext from '../../../assets/table-next.png';
import TablePrev from '../../../assets/table-prev.png';

interface TPaginationComponent {
  page: number;
  total: number;
  pageSize: number;
  rangePageSize?: number[];
  setPage: (d: number) => void;
  setPageSize?: (d: number) => void;
  setPageOnly?: boolean;
}
const PaginationComponent: React.FC<TPaginationComponent> = ({
  page, 
  total, 
  pageSize,
  rangePageSize = [10, 20, 50, 100], 
  setPage, 
  setPageSize,
  setPageOnly,
}) => {
  const handlePageChange = (page: number): void => {
    setPage(page);
  };
  
  return (
    <div className="flex lg:items-center lg:justify-between gap- flex-col lg:flex-row">
      {
        !setPageOnly && (
          <div className="flex gap-3 items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-[200px] justify-between rounded-xl h-[36px] px-3 items-center text-sm font-medium text-[#333333] border-[1px] border-[#BBBBBB] active:border-purple">
                  {pageSize} / Page
                  <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-[#798F9F] " aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute w-[200px] left-0 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {rangePageSize.map((d: number) => (
                      <Menu.Item key={d}>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              if (setPageSize) {
                                setPageSize(d);
                              };
                            }}
                            className={`${
                              active ? 'bg-light-purple' : ''
                            } ${pageSize === d ? 'text-purple font-bold' : ''} group flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm`}>
                            {d} / Page
                            {
                              pageSize === d && (
                                <img src={CheckMark} className="w-6 h-6" />
                              )
                            }
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <p className="text-sm font-bold">{total ? `Total ${total} items` : ``}</p>
          </div>
        )
      }
      <div id="pagination">
        <Pagination
          className="flex lg:w-auto w-full gap-2"
          currentPage={page}
          edgePageCount={2}
          middlePagesSiblingCount={1}
          setCurrentPage={handlePageChange}
          totalPages={countPage(total, pageSize)}
          truncableClassName="w-10 px-0.5 text-center text-[14px] items-center flex justify-center rounded-xl bg-[#E5DFEC] w-[36px] h-[36px] text-white"
          truncableText="..."
        >
          <Pagination.PrevButton 
            type='button' 
            className="flex justify-center items-center w-[36px] h-[36px]"
          >
            <img src={TablePrev} />
          </Pagination.PrevButton>

          <Pagination.PageButton
            type='button'
            activeClassName="text-white bg-primary font-semibold"
            className="flex justify-center items-center w-[36px] h-[36px] cursor-pointer text-sm gap-1 rounded-xl"
            inactiveClassName="text-white bg-[#E5DFEC] font-semibold"
          />

          <Pagination.NextButton 
            type='button' 
            className="flex justify-center items-center w-[36px] h-[36px]"
          >
            <img src={TableNext} />
          </Pagination.NextButton>
        </Pagination>
      </div>
    </div>
  );
};
export default PaginationComponent;

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Pagination } from 'react-headless-pagination';
import './style.css';
import countPage from '../../../utils/countPage';
const rangePageSize = [10, 25, 50, 100];

interface TPaginationComponent {
  page: number;
  total: number;
  pageSize: number;
  setPage: (d: number) => void;
  setPageSize: (d: number) => void;
}
const PaginationComponent: React.FC<TPaginationComponent> = props => {
  const { page, total, pageSize, setPage, setPageSize } = props;

  const handlePageChange = (page: number): void => {
    setPage(page);
  };
  return (
    <div className="flex lg:items-center lg:justify-between gap-6  flex-col lg:flex-row">
      <div className="flex gap-3 items-center">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded-xl bg-[#F3F7FB]  px-4 py-2 text-sm font-medium text-[ #333333]  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
            <Menu.Items className="absolute  -top-32 w-24 left-0 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                {rangePageSize.map((d: number) => (
                  <Menu.Item key={d}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          setPageSize(d);
                        }}
                        className={`${
                          active ? 'bg-primary text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                        {d}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <p className="text-sm font-semibold">Total {total} items</p>
      </div>
      <div id="pagination">
        <Pagination
          className="flex lg:w-auto w-full"
          currentPage={page}
          edgePageCount={2}
          middlePagesSiblingCount={1}
          setCurrentPage={handlePageChange}
          totalPages={countPage(total, pageSize)}
          truncableClassName="w-10 px-0.5 text-center border border-l-0 text-[14px] items-center flex justify-center"
          truncableText="...">
          <Pagination.PrevButton className="flex justify-center items-center w-[43px] h-[38px] border rounded-tl-xl rounded-bl-xl">
            <ChevronLeftIcon className=" h-5 w-5 text-[#798F9F] " aria-hidden="true" />
          </Pagination.PrevButton>
          <Pagination.PageButton
            activeClassName="text-[#28BCDC] bg-[#F1FDFF] border-[#28BCDC] font-semibold"
            className="flex justify-center items-center w-[43px] h-[38px] border  cursor-pointer text-sm"
            inactiveClassName="text-[#333333] font-semibold border-l-0"
          />

          <Pagination.NextButton className="flex justify-center items-center w-[43px] h-[38px] border border-l-0 rounded-tr-xl rounded-br-xl">
            <ChevronRightIcon className=" h-5 w-5 text-[#798F9F] " aria-hidden="true" />
          </Pagination.NextButton>
        </Pagination>
      </div>
    </div>
  );
};
export default PaginationComponent;

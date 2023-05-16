import { useTranslation } from 'react-i18next';
import DropDown from '../../components/molecules/DropDown';
import DropDownList from '../../components/molecules/DropDownList';
import CkEditor from '../../components/atoms/Ckeditor';
import SortableTreeComponent from '../../components/atoms/SortableTree';
import Table from '../../components/atoms/Table';
import { COLUMNS } from './column';
import { useCallback } from 'react';
import type { SortingState } from '@tanstack/react-table';
import PaginationComponent from '../../components/atoms/Pagination';

export default function Dashboard() {
  const { t } = useTranslation();
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      // setSortBy(sortModel[0].id)
      // setDirection(sortModel[0].desc ? "desc" : "asc")
    }
  }, []);
  return (
    <div className='overflow-auto'>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <br />
      <button className="btn btn-primary btn-sm ">This button made with daisyui</button>
      <br />
      <h1 className="my-10"> {t('dashboard.sample') ?? ''}</h1>
      <div className="w-96">
        <DropDown
          defaultValue="Ayam"
          items={[
            {
              value: 'Ayam',
              label: 'Daging Ayam',
            },
            {
              value: 'Sapi',
              label: 'Daging Sapi',
            },
          ]}
        />
      </div>
      <h1 className="m-6">INI LIST</h1>
      <div className="w-80">
        <DropDownList
          defaultValue={['Ayam', 'Sapi', 'Ular']}
          items={[
            {
              value: 'Ayam',
              label: 'Daging Ayam',
            },
            {
              value: 'Sapi',
              label: 'Daging Sapi',
            },
            {
              value: 'Ular',
              label: 'Daging Ular',
            },
            {
              value: 'Domba',
              label: 'Daging Domba',
            },
            {
              value: 'Manusia',
              label: 'Daging Manusia',
            },
          ]}
        />
      </div>
      <CkEditor />
      <SortableTreeComponent />
      <Table
        rows={dummy}
        columns={COLUMNS}
        loading={false}
        error={false}
        manualPagination={true}
        manualSorting={true}
        onSortModelChange={handleSortModelChange}
      />
      <PaginationComponent
        page={1}
        setPage={() => null}
        total={100}
        pageSize={10}
        setPageSize={() => null}
      />
    </div>
  );
}

const dummy = [
  {
    name: 'Super Admin',
    description: 'Ini adalah super admin',
  },
];

import { useTranslation } from 'react-i18next';
import DropDown from '../../components/molecules/DropDown';
import DropDownList from '../../components/molecules/DropDownList';
import CkEditor from '../../components/atoms/Ckeditor';
import Table from '../../components/molecules/Table';
import { COLUMNS } from './column';
import { useCallback } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Container } from './components/Container';

export default function Dashboard() {
  const { t } = useTranslation();
  const handleSortModelChange = useCallback((sortModel: SortingState) => {
    if (sortModel.length) {
      // setSortBy(sortModel[0].id)
      // setDirection(sortModel[0].desc ? "desc" : "asc")
    }
  }, []);

  return (
    <div className="overflow-auto">
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>

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
      <br />
      <br />
      <Table
        rows={dummy}
        columns={COLUMNS}
        loading={false}
        error={false}
        manualPagination={true}
        manualSorting={true}
        onSortModelChange={handleSortModelChange}
      />
    </div>
  );
}

const dummy = [
  {
    name: 'Fariz',
    description: 'Ini adalah Super Saiyan 1',
  },
  {
    name: 'Andhika',
    description: 'Ini adalah Super Saiyan 2',
  },
  {
    name: 'Samuel',
    description: 'Ini adalah Super Saiyan 3',
  },
];

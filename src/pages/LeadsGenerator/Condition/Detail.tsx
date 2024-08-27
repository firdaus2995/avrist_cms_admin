import { CheckBox } from '@/components/atoms/Input/CheckBox';
import Typography from '@/components/atoms/Typography';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import FormList from '@/components/molecules/FormList';
import { styleButton } from '@/utils/styleButton';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const conditionsData = [
  {
    id: 1,
    text: 'Akun wajib aktif dalam waktu 6 bulan setelah dilakukan email blasting',
    subConditions: [
      {
        value: 'Percaya Diri',
        score: 6,
      },
      {
        value: 'Baik-baik saja',
        score: 5,
      },
      {
        value: 'Stres',
        score: 4,
      },
      {
        value: 'Tidak yakin',
        score: 3,
      },
    ],
  },
  {
    id: 2,
    text: 'Akun tidak boleh di nonaktifkan dalam waktu 3 bulan pertama',
    subConditions: [
      {
        value: 'Percaya Diri',
        score: 6,
      },
      {
        value: 'Baik-baik saja',
        score: 5,
      },
      {
        value: 'Stres',
        score: 4,
      },
      {
        value: 'Tidak yakin',
        score: 3,
      },
    ],
  },
  {
    id: 3,
    text: 'Pengguna wajib login minimal 1 kali setiap 6 bulan',
    subConditions: [
      {
        value: 'Percaya Diri',
        score: 6,
      },
      {
        value: 'Baik-baik saja',
        score: 5,
      },
      {
        value: 'Stres',
        score: 4,
      },
      {
        value: 'Tidak yakin',
        score: 3,
      },
    ],
  },
];

const LeadsGeneratorConditionDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname ?? '';

  const [isTitle, setTitle] = useState<string>('Edit Condition');
  const [isEditable, setEditable] = useState<boolean>(false);

  const [expandedConditions, setExpandedConditions] = useState<number[]>([]);

  // Toggle the condition when it is clicked
  const toggleCondition = (id: number) => {
    setExpandedConditions(prev =>
      prev.includes(id) ? prev.filter(condId => condId !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (pathname.includes('new')) {
      setEditable(true);
      setTitle('Add Condition');
    }
  }, [pathname]);

  return (
    <TitleCard
      hasBack
      onBackClick={() => {
        navigate(-1);
      }}
      title={isTitle}
      topMargin="mt-2"
      TopSideButtons={
        !isEditable && (
          <div
            className={styleButton({ variants: 'secondary' })}
            onClick={() => {
              setEditable(true);
            }}>
            Edit Data
          </div>
        )
      }>
      <div className="flex flex-col gap-y-4 pb-10 border-b-2">
        <div className="flex flex-col gap-y-2 w-2/3">
          <FormList.TextField
            disabled={!isEditable}
            // key="fieldId"
            // labelRequired
            labelTitle="Condition Title"
            themeColor="primary"
            placeholder="Condition Title"
            value={''}
            // error={!!attributesErrors.fieldId}
            // helperText={attributesErrors.fieldId}
            // onChange={(e: any) => {
            //   setNewAttributes({ ...newAttributes, fieldId: e.target.value });
            // }}
            border={false}
          />
          <div className="flex items-center">
            <Typography type="body" size="s" weight="bold" className="w-[222px] ml-1">
              Result Name
            </Typography>
            <FormList.DropDown
              disabled={!isEditable}
              defaultValue={''}
              items={[]}
              onChange={(e: any) => {
                console.log(e);
              }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg shadow-md w-2/3 bg-light-purple-2">
          <h3 className="text-lg font-bold mb-4">Conditions</h3>
          <div className="space-y-2">
            {conditionsData.map(condition => (
              <div key={condition.id} className="bg-bright-purple-2 rounded-[12px]">
                <div
                  className={`${
                    expandedConditions.includes(condition.id)
                      ? 'border-b-2 border-border-purple'
                      : ''
                  } flex items-center gap-[12px] px-[12px] py-[8px]`}>
                  <CheckBox
                    defaultValue={expandedConditions.includes(condition.id)}
                    updateFormValue={_e => {
                      toggleCondition(condition.id);
                    }}
                    labelTitle={condition.text}
                    updateType={''}
                  />
                </div>
                {expandedConditions.includes(condition.id) && (
                  <div className="pl-6 mt-2 bg-bright-purple-2 rounded-md p-2">
                    {condition.subConditions.map((subCond, index) => (
                      <div key={index} className="flex items-center gap-[12px] px-[12px] py-[8px]">
                        <CheckBox
                          defaultValue={false}
                          updateFormValue={_e => {}}
                          labelTitle={subCond?.value}
                          updateType={''}
                        />
                        <div className="py-[2px] px-3 w-[42px] flex items-center justify-center rounded-xl bg-bright-purple-3 text-primary font-bold">
                          {subCond?.score}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end items-center pt-5">
        <div className={styleButton({ variants: 'third' })} onClick={() => {}}>
          Cancel
        </div>
        <div
          className={styleButton({ variants: 'secondary', disabled: !isEditable })}
          onClick={() => {
            setEditable(false);
          }}>
          Save as Draft
        </div>
        <div
          className={styleButton({ variants: 'success', disabled: !isEditable })}
          onClick={() => {
            setEditable(false);
          }}>
          Save
        </div>
      </div>
    </TitleCard>
  );
};

export default LeadsGeneratorConditionDetail;

import { useEffect, useState } from 'react';

import { useGetEmailFormBuilderQuery } from '@/services/EmailFormBuilder/emailFormBuilderApi';

import ChevronUp from '@/assets/chevronup.png';
import ChevronDown from '@/assets/chevrondown.png';
import ErrorSmallIcon from '@/assets/error-small.svg';

const EmailForm = ({
  id,
  inputStyle,
  disabled,
  themeColor,
  inputWidth,
  inputHeight,
  roundStyle = 'xl',
  error,
  helperText,
  onChange,
  resetValue,
  defaultValue,
}: any) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue || '');
  const [isOpen, setIsOpen] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [filteredItemList, setFilteredItemList] = useState(itemList);
  const [selectedDefaultValue, setSelectedDefaultValue] = useState<any>('');

  const handleOptionClick = (option: string) => {
    setSearchTerm(option);
    setIsOpen(false);
  };

  useEffect(() => {
    setSearchTerm(selectedDefaultValue.label || '');
    setIsOpen(false);
  }, [resetValue, selectedDefaultValue]);

  // TABLE PAGINATION STATE
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(999);
  const [direction] = useState('asc');
  const [sortBy] = useState('id');
  const [search] = useState('');

  // RTK GET DATA
  const fetchQuery = useGetEmailFormBuilderQuery(
    {
      pageIndex,
      limit: pageLimit,
      sortBy,
      direction,
      search,
    },
    {},
  );
  const { data } = fetchQuery;

  useEffect(() => {
    if (data) {
      const tempItemList = data?.postTypeList?.postTypeList.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });

      setItemList(tempItemList);

      // Update filteredItemList based on searchTerm
      const filteredItems = tempItemList.filter((item: any) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredItemList(filteredItems);
    }
  }, [data, searchTerm]);

  useEffect(() => {
    if (defaultValue && itemList) {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      const selected = itemList.find(obj => obj.value === Number(defaultValue));
      setSelectedDefaultValue(selected);
    }
  }, [defaultValue, itemList]);

  return (
    <div className="relative w-full" style={{ flex: '1' }}>
      <div
        style={{ width: inputWidth ?? '100%', height: inputHeight ?? '' }}
        className={`
            flex
            flex-row
            items-center
            input
            input-bordered 
            rounded-${roundStyle} ${themeColor ? `border-${themeColor}` : ''} 
            focus-within:outline 
            focus-within:outline-2 
            focus-within:outline-offset-2 
            focus-within:outline-${themeColor ?? '[#D2D4D7]'} 
            ${disabled ? 'pointer-events-none ' : ''} 
            ${error ? 'border-reddist' : ''}
          `}>
        <input
          id={id}
          type="text"
          placeholder="Search or select an option..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`w-full h-full rounded-3xl px-1 outline-0 ${inputStyle} ${
            disabled ? 'text-[#637488]' : ''
          }`}
        />
        <div
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`
            flex items-center 
            justify-center cursor-pointer 
            w-10 h-10 rounded-lg 
            -mr-3 hover:bg-slate-300
            ${isOpen && 'animate-pulse'}
          `}>
          <img src={isOpen ? ChevronUp : ChevronDown} className="w-6 h-6" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-xl w-full max-h-64 shadow-lg overflow-auto">
          {filteredItemList.length > 0 ? (
            <ul>
              {filteredItemList.map((option: any, index: any) => (
                <li
                  key={index}
                  onClick={() => {
                    handleOptionClick(option.label);
                    onChange(option);
                  }}
                  className={`px-4 py-2 rounded-xl cursor-pointer hover:bg-light-purple m-1 ${
                    option.label === searchTerm &&
                    'text-primary font-bold flex flex-row justify-between'
                  }`}>
                  {option.label}
                  {option.label === searchTerm && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 font-bold">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-2 text-gray-500">No matching options</p>
          )}
        </div>
      )}
      {error && (
        <div className="flex flex-row px-1 py-2">
          <img src={ErrorSmallIcon} className="mr-3" />
          <p className="text-reddist text-sm">{helperText}</p>
        </div>
      )}
    </div>
  );
};

export default EmailForm;

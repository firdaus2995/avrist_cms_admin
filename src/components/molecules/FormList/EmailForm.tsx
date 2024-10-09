import { useEffect, useState, useRef } from 'react';
import { useGetEmailFormBuilderQuery } from '@/services/EmailFormBuilder/emailFormBuilderApi';
import ChevronUp from '@/assets/chevronup.png';
import ChevronDown from '@/assets/chevrondown.png';
import ErrorSmallIcon from '@/assets/error-small.svg';
import { t } from 'i18next';

const EmailForm = ({
  id,
  inputStyle,
  disabled,
  themeColor,
  inputWidth,
  inputHeight = 36,
  roundStyle = 'xl',
  error,
  helperText,
  onChange,
  resetValue,
  defaultValue,
}: any) => {
  const [searchTerm, setSearchTerm] = useState(''); // Mulai dengan string kosong
  const [isOpen, setIsOpen] = useState(false);
  const [itemList, setItemList] = useState<any[]>([]);
  const [filteredItemList, setFilteredItemList] = useState(itemList);
  const [selectedDefaultValue, setSelectedDefaultValue] = useState<any>(null); // Inisialisasi null

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Buat ref untuk dropdown

  const handleOptionClick = (option: any) => {
    setSearchTerm(''); // Set search term dengan label opsi yang dipilih
    setSelectedDefaultValue(option); // Simpan opsi yang dipilih
    setIsOpen(false); // Tutup dropdown
    onChange(option); // Kirim nilai ke parent
  };

  useEffect(() => {
    if (resetValue) {
      setSearchTerm(''); // Reset search term jika resetValue di-trigger
      setSelectedDefaultValue(null); // Reset nilai terpilih
      setFilteredItemList(itemList); // Tampilkan semua item
      setIsOpen(false); // Tutup dropdown
    }
  }, [resetValue, itemList]);

  // TABLE PAGINATION STATE
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(-1);
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
      const tempItemList = data?.postTypeList?.postTypeList.map((element: any) => ({
        value: Number(element.id),
        label: element.name,
      }));

      setItemList(tempItemList); // Set itemList
      setFilteredItemList(tempItemList); // Juga set filteredItemList
    }
  }, [data]);

  // FILTER LIST ITEM BERDASARKAN SEARCH TERM
  useEffect(() => {
    const filtered = itemList.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredItemList(filtered); // Set filteredItemList berdasarkan searchTerm
  }, [itemList, searchTerm]);

  // SET NILAI DEFAULT JIKA ADA
  useEffect(() => {
    if (defaultValue && itemList) {
      const intDefaultValue = Number(defaultValue);
      const selected = itemList.find((obj: any) => obj.value === intDefaultValue);
      setSelectedDefaultValue(selected);
      if (selected) {
        setSearchTerm(selected.label); // Set searchTerm berdasarkan nilai default
      }
    }
  }, [defaultValue, itemList]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Tutup dropdown saat klik di luar
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative w-full" style={{ flex: '1' }} ref={dropdownRef}>
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
          ${disabled ? 'pointer-events-none bg-disabled-input' : ''} 
          ${error ? 'border-reddist' : ''}
        `}>
        <input
          id={id}
          type="text"
          placeholder="Search or select an option..."
          value={
            isOpen
              ? searchTerm !== ''
                ? searchTerm
                : selectedDefaultValue?.label
              : selectedDefaultValue?.label
          }
          onChange={e => {
            setSearchTerm(e.target.value);
            setSelectedDefaultValue(null); // Reset nilai terpilih saat mencari
            setIsOpen(true); // Update search term
            if (e.target.value === '') {
              onChange({value: null, label: ''});
            }
          }}
          onClick={() => {
            setIsOpen(!isOpen); // Toggle dropdown
          }}
          className={`text-sm w-full h-full rounded-3xl px-1 outline-0 ${inputStyle} ${
            disabled ? 'text-[#637488] bg-disabled-input' : ''
          }`}
        />
        <div
          onClick={() => {
            setIsOpen(!isOpen); // Toggle dropdown
          }}
          className={`flex items-center justify-center cursor-pointer w-10 h-10 rounded-lg -mr-3 hover:bg-slate-300 ${
            isOpen && 'animate-pulse'
          }`}>
          <img src={isOpen ? ChevronUp : ChevronDown} className="w-6 h-6" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-xl w-full max-h-64 shadow-lg overflow-auto z-50">
          {filteredItemList.length > 0 ? (
            <div>
              {filteredItemList.map((option: any, index: any) => (
                <div
                  key={index}
                  onClick={() => {
                    handleOptionClick(option); // Set opsi yang dipilih
                  }}
                  className={`px-4 py-2 rounded-xl cursor-pointer hover:bg-light-purple m-1 ${
                    option.value === selectedDefaultValue?.value &&
                    'text-primary font-bold flex flex-row justify-between'
                  }`}>
                  {option.label}
                  {option.value === selectedDefaultValue?.value && (
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
                </div>
              ))}
            </div>
          ) : (
            <p className="px-4 py-2 text-gray-500">
              {t('components.molecules.no-matching-option')}
            </p>
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

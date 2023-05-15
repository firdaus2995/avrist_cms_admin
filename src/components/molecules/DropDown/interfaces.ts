export interface IDropDown {
  items?: Array<{
    value: string | number | boolean;
    label: string;
  }>;
  defaultValue?: string | number | boolean;
  onSelect?: (event: React.SyntheticEvent, value: string | number | boolean) => void;
}

export interface IItems {
  value: string | number | boolean;
  label: string;
}

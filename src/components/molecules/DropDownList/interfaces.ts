export interface IDropDownList {
  items?: Array<{
    value: string | number | boolean;
    label: string;
  }>;
  defaultValue?: Array<string | number | boolean>;
  onSelect?: (event: React.SyntheticEvent, value: Array<string | number | boolean>) => void;
}

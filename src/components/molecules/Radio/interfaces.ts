export interface IRadio {
  labelTitle?: string;
  labelStyle?: string;
  labelRequired?: boolean;
  items?: any;
  defaultSelected?: string | number | boolean;
  onSelect?: (event: React.ChangeEvent<HTMLInputElement>, value: string | number | boolean) => void;
}

export interface IItems {
  value: any;
  label: string;
}

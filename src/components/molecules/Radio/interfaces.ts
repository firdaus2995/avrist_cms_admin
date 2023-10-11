export interface IRadio {
  labelTitle?: string;
  labelStyle?: string;
  labelRequired?: boolean;
  items?: any;
  defaultSelected?: string | number | boolean;
  onSelect?: (event: React.ChangeEvent<HTMLInputElement>, value: string | number | boolean) => void;
  containerStyle?: any;
  error?: any;
  helperText?: any;
}

export interface IItems {
  value: any;
  label: string;
}

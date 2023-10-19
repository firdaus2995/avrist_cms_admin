export interface IDropDown {
  labelTitle?: string;
  labelStyle?: string;
  labelEmpty?: string;
  labelRequired?: boolean;
  labelWidth? : number;
  inputWidth?: number;
  direction?: string;
  items?: Array<{
    value: string | number | boolean;
    label: string;
    labelExtension? : string;
  }>;
  defaultValue?: string | number | boolean;
  error?: any;
  helperText?: any;
  onSelect?: (event: React.SyntheticEvent, value: string | number | boolean) => void;
}

export interface IItems {
  value: string | number | boolean;
  label: string;
  labelExtension? : string;
}

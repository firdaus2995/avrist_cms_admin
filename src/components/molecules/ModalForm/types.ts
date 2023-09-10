export interface IModalForm {
  open: boolean;
  width?: number;
  height?: number;
  formTitle: string;
  submitTitle: string;
  submitType?: string;
  cancelTitle: string;
  loading?: boolean;
  submitAction: () => void;
  cancelAction: () => void;
  children?: any;
  submitDisabled?: boolean;
  additionalButton?: any;
}

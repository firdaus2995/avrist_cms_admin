export interface IModalForm {
  open: boolean;
  formTitle: string;
  submitTitle: string;
  submitType: string;
  cancelTitle: string;
  loading?: boolean;
  submitAction: () => void;
  cancelAction: () => void;
  children?: any;
  submitDisabled?: boolean
}

export interface IModalForm {
  open: boolean;
  formTitle: string;
  submitTitle: string;
  cancelTitle: string;
  loading?: boolean;
  submitAction: () => void;
  cancelAction: () => void;
  children?: any;
}

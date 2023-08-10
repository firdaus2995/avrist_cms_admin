export interface IModalForm {
  open: boolean;
  width?: number;
  height?: number;
  formTitle: string;
  submitTitle: string;
  cancelTitle: string;
  loading?: boolean;
  submitAction: () => void;
  cancelAction: () => void;
  children?: any;
}

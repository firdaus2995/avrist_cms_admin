export interface IModalConfirm {
  open: boolean;
  submitTitle: string;
  cancelTitle: string;
  message: string;
  loading?: boolean;
  submitAction: () => void;
  cancelAction: () => void;
}

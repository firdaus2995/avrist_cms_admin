export interface IModalDisplay {
  open: boolean;
  width?: number;
  height?: number;
  title: string | null;
  cancelAction: () => void;
  children?: any;
}

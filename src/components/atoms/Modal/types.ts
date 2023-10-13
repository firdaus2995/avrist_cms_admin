export interface IModal {
  toggle: () => void;
  open: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  title?: React.ReactNode;
  fullscreen?: boolean;
}

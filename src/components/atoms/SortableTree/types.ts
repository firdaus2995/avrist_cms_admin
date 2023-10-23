export interface ISortableTree {
  data: any[];
  onChange: (node: any, data: any) => void;
  onClick: (data: any, action?: string) => void;
}

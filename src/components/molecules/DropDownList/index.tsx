interface IDropDownList {
  items?: Array<{
    value: string | number | boolean;
    label: string;
  }>
}

const DropDownList = ({
  items,
}: IDropDownList) => {
  if (!items || items.length < 1) {
    return (
      <h2 className="text-red-700">Component Dropdown List Error</h2>
    )
  }
  
  return (
    <div>DDLIST</div>
  )
}

export default DropDownList;
import Skeleton from "@mui/material/Skeleton"
import React from "react"
interface ILoader {
  columnsLength: number;
  rowsLength: number;
}
const Loader: React.FC<ILoader> = (props) => {
  const { columnsLength , rowsLength} = props

  const data: any = []
  for (let index = 0; index < rowsLength; index++) {
    const d: any = Array.from(Array(columnsLength).keys())

    data.push(d)
  }

  return data.map((d: any, i: number) => (
    <tr key={i} className="h-[70px]">
      {d.map((_c: any, i2: number) => (
        <td key={i2}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        </td>
      ))}
    </tr>
  ))
}
export default Loader

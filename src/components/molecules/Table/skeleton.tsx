import Skeleton from "@mui/material/Skeleton"
import React from "react"
interface ILoader {
  columnsLength: number
}
const Loader: React.FC<ILoader> = (props) => {
  const { columnsLength } = props

  const data: any = []
  for (let index = 0; index < 10; index++) {
    const d: any = Array.from(Array(columnsLength).keys())

    data.push(d)
  }

  return data.map((d: any, i: number) => (
    <tr key={i}>
      {d.map((_c: any, i2: number) => (
        <td key={i2}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        </td>
      ))}
    </tr>
  ))
}
export default Loader

import { chunk } from "lodash"

const countPage = (total: number, perPage: number): number => {
  const arr = Array.from(Array(total).keys())
  const chunks = chunk(arr, perPage)
  return chunks.length
}

export default countPage

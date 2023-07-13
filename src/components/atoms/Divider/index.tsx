import React from "react"

interface IDivider {
  color?: string;
}

export const Divider: React.FC<IDivider> = ({
  color,
}) => {
  return (
    <hr style={{
      borderColor: color ?? '',
    }}/>
  )
}
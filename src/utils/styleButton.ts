interface IProps {
  variants: string;
  className?: string;
  disabled?: boolean;
}

const conditionalStyle = (
  disabled?: boolean,
  defaultStyle?: string,
  disabledStyle?: string // text-bodyCaption bg-stroke
) => {
  return (
    (disabled ? disabledStyle ?? "text-bodyCaption bg-stroke" : defaultStyle) ??
    ""
  );
};

const styleButton: (e:IProps) => string = ({
  variants,
  className = "",
  disabled = false,
}: IProps) => {
  let baseStyle = "cursor-pointer flex justify-center items-center min-w-[120px] h-[36px] rounded-xl font-bold text-sm";
  switch (variants) {
    case "secondary":
      baseStyle =
        baseStyle +
        ` text-primary ${conditionalStyle(
          disabled,
          "bg-white border-primary border",
          "bg-stroke"
        )}`;
      break;
    case "third":
      baseStyle =
        baseStyle +
        ` ${conditionalStyle(
          disabled,
          "text-dark-grey bg-white border border-dark-grey"
        )}`;
      break;
    case "success":
      baseStyle =
        baseStyle +
        ` ${conditionalStyle(
          disabled,
          "text-white bg-success"
        )}`;
      break;
      case "error":
      baseStyle =
        baseStyle + ` ${conditionalStyle(disabled, "text-dark-reddist bg-red-light border border-dark-reddist")}`;
      break;
    case "disable":
      baseStyle = baseStyle + " text-bodyCaption bg-stroke";
      break;
    case "fourth":
      baseStyle = `${baseStyle} bg-white text-tertiary-warning border border-solid border-tertiary-warning`;
      break;
    case "blues":
      baseStyle = `${baseStyle} bg-[#CFE3FB] text-[#829BC7] border border-solid border-[#829BC7]`;
      break;
    case "primary":
    default:
      baseStyle =
        baseStyle +
        ` ${conditionalStyle(disabled, "btn-primary text-white")}`;
      break;
  }

  if (!disabled) {
    baseStyle = baseStyle + " active:bg-primary active:text-white";
  } else {
    baseStyle = baseStyle + " cursor-not-allowed";
  }

  if (className) {
    baseStyle = baseStyle + " " + className;
  }

  return baseStyle;  
}

export { styleButton };
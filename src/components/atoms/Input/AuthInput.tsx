import { Typography } from '../Typography';

interface IAuthInputProps {
  label: string;
  placeholder: string;
  error?: string;
  styleClass?: string;
}

const AuthInput: React.FC<IAuthInputProps> = ({ label, placeholder, error, styleClass }) => {
  const hasError = !!error;
  const classNames = `flex justify-between ${styleClass}`;
  return (
    <div className={classNames}>
      <label htmlFor={label} className="mt-2 mr-5 flex-1">
        {label}
      </label>
      <div className="flex flex-col flex-grow flex-2">
        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-1">
          <input
            className={`pl-2 outline-none border-none w-full`}
            type="text"
            id={label}
            placeholder={placeholder}
          />
        </div>
        {hasError && (
          <Typography type="body" size="xs" weight="regular" styleClass="text-error">
            Extra Large Bold Body Text
          </Typography>
        )}
      </div>
    </div>
  );
};

export default AuthInput;

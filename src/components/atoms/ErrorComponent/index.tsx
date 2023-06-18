import NoResultIcon from '@/../assets/no-result.svg';
import PropTypes from 'prop-types';

interface IErrorComponent {
  colspan?: number;
  message?: string;
}

export const ErrorComponent: React.FC<IErrorComponent> = ({ colspan, message }) => {
  return (
    <tr>
      <td className="" colSpan={colspan}>
        <div className="w-full h-[300px] flex justify-center items-center flex-col">
          <img src={NoResultIcon} width={250} height={250} />
          <p className="font-lato text-gray-400 text-2xl">{message}</p>
        </div>
      </td>
    </tr>
  );
};

ErrorComponent.propTypes = {
  colspan: PropTypes.number,
  message: PropTypes.string,
};

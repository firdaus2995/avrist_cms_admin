import { IModal } from './types';

export default function Modal(props: IModal) {
  return (
    <div
      className={`fixed items-center top-0  left-0 right-0 z-50  w-full  overflow-x-hidden overflow-y-auto inset-0  h-full bg-[rgba(88,99,121,0.32)] ${
        props.open ? 'flex' : 'hidden'
      } flex justify-center lg:items-center items-end`}
      style={{ margin: 0 }}>
      <div
        className="relative "
        style={{
          width: props.fullscreen ? '100%' : props.width ? props.width : 651,
          height: props.fullscreen ? '100%' : 'auto',
        }}>
        <div className="relative bg-white rounded-2xl shadow ">
          {props.title && (
            <div
              className={`flex items-start justify-between p-4  rounded-t ${
                !props.fullscreen ? 'border-b' : ''
              }`}>
              <div className="text-xl font-semibold text-gray-900 ">{props.title}</div>
              <button
                onClick={() => {
                  props.toggle();
                }}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  ">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          )}
          <div
            className="p-6 space-y-6  overflow-y-auto"
            style={{
              maxHeight: props.fullscreen ? '93vh' : props.height ? props.height : 447,
            }}>
            {props.children}
          </div>
          {props.footer && (
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
              {props.footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

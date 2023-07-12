const NewModalLog = (props: any) => {
  const { isOpen } = props;

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">This modal works with a hidden checkbox!</p>
        <div className="modal-action">
          <label htmlFor="my_modal_6" className="btn">
            Close!
          </label>
        </div>
      </div>
    </div>
  );
};

export default NewModalLog;
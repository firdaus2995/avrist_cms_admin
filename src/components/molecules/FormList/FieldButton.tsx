import Typography from '@/components/atoms/Typography';

export default function FieldButton({ name, buttonTitle, onClick, visible = true }: any) {
  return (
    <>
      <div className="flex flex-row items-center">
        <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
          {name}
        </Typography>
        {visible ? (
          <div className="btn btn-primary w-48" onClick={onClick}>
            {buttonTitle}
          </div>
        ) : (
          <div />
        )}
      </div>
    </>
  );
}

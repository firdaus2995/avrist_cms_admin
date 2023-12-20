import Typography from "../../atoms/Typography";

interface IRectangleBadge {
  title: string;
  comment: string;
};

const RectangleBadge = ({
  title,
  comment,
}: IRectangleBadge) => {
  return (
    <div className='flex flex-row gap-3 bg-[#FBF8FF] p-4 rounded-lg my-6 max-w-[700px]'>
      <Typography size='s' weight='bold' className='min-w-[140px]'>{title}</Typography>
      <Typography size='s' className='text-reddist'>{comment}</Typography>
    </div>          
  )
};

export default RectangleBadge;

import React from 'react';
import Typography from '../../../components/atoms/Typography';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let style = '';
  let title = '';
  switch (status.toLowerCase()) {
    case 'waiting_review':
      style = 'bg-[#F8E7CF] border-[#FF8E3C]';
      title = 'Waiting Review';
      break;
    case 'waiting_approve':
      style = 'bg-[#CFE3FB] border-[#6F92C6]';
      title = 'Waiting Approval';
      break;
    case 'draft':
      style = 'bg-[#E4E4E4] border-[#A9AAB5]';
      title = 'Draft';
      break;
    case 'delete_review':
      style = 'bg-[#EBD2CE] border-[#D09191]';
      title = 'Delete Review';
      break;
    case 'delete_approve':
      style = 'bg-[#EBD2CE] border-[#D09191]';
      title = 'Delete Approval';
      break;
    case 'approved':
      style = 'bg-[#D9E7D6] border-[#8AA97C]';
      title = 'Approve';
      break;
    case 'rejected':
      style = 'bg-[#EBD2CE] border-[#D09191]';
      title = 'Rejected';
      break;
    case 'delete_rejected':
      style = 'bg-[#EBD2CE] border-[#D09191]';
      title = 'Delete Rejected';
      break;
    default:
      style = 'bg-[#E4E4E4] border-[#A9AAB5]';
      title = '-';
      break;
  }

  const badgeClasses = `flex w-28 items-center justify-center text-gray h-7 border-2 ${style}`;

  return (
    <span className={badgeClasses}>
      <Typography type="body" size="xs" weight="medium">
        {title}
      </Typography>
    </span>
  );
};

export default StatusBadge;

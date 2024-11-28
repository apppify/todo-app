import React from 'react';

import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  isSelected: boolean;
  onClick: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isSelected, onClick }) => {
  return (
    <Badge
      className={`cursor-pointer ${isSelected ? statusColors[status] : 'bg-gray-300'}`}
      onClick={onClick}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;

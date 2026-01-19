'use client';

import { Chip } from '@mui/material';
import { AbChipProps } from '../types/abn.types';
import { STATUS_COLOR_MAP } from '../constants/abn.const';

const AbChip = ({ label, size = 'small' }: AbChipProps) => {
  const color =
    STATUS_COLOR_MAP[label.toLowerCase()] ?? 'default';

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      className='rounded-md!'
    />
  );
};

export default AbChip;

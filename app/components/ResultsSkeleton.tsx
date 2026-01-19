import { Box, Skeleton } from '@mui/material';

const ROWS = 20;
const COLS = 5;

const ResultsSkeleton = () => {
  return (
    <Box className="py-4 space-y-3">
      {Array.from({ length: ROWS }).map((_, rowIndex) => (
        <Box key={rowIndex} className="flex gap-4">
          {Array.from({ length: COLS }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rectangular"
              height={32}
              className="flex-1 rounded"
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ResultsSkeleton;
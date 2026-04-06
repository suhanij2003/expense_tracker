import React from 'react';
import { Skeleton } from '@mui/material';

/**
 * Reusable skeleton loader component.
 * Props are passed directly to MUI Skeleton.
 * Example usage: <SkeletonLoader variant="text" width="80%" />
 */
const SkeletonLoader = (props) => {
  return <Skeleton animation="wave" {...props} />;
};

export default SkeletonLoader;

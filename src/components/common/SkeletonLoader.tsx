import { Skeleton } from "@chakra-ui/react";
import React from "react";

interface SkeletonLoaderProps {
  count: number;
  height: string;
  width: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count,
  height,
  width,
}) => {
  return (
    <>
      {[...Array(count)].map((__, index) => (
        <Skeleton key={index} height={height} width={width} borderRadius={4} />
      ))}
    </>
  );
};

export default SkeletonLoader;

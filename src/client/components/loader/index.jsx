import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Box from "@material-ui/core/Box";

const Loader = () => {
  const headerHeight = "15vh";
  const height = "80vh";
  
  return (
    <Box p={2}>
      <Skeleton height={headerHeight} />
      <Skeleton variant="rect" height={height} />
    </Box>
  );
};

export default Loader;

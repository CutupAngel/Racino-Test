import * as React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';

function Repository({ currentUser, repo }: { currentUser: string, repo: any }) {
  return (
    <Link href={"https://github.com/" + currentUser + "/" + repo?.name} underline="none" >
      <Grid display="flex" flexDirection="column">
        <Box sx={{ border: "0px", borderBottomWidth: "1px", borderColor: 'grey', borderStyle: 'solid' }}>
          <Typography>{repo?.name}</Typography>
          <Typography variant='caption'>{repo?.description}</Typography>
        </Box>
      </Grid>
    </Link>
  );
}

export default Repository;

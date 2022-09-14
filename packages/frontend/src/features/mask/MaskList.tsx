import { Chip, Grid } from '@mui/material';
import { FunctionComponent, useMemo } from 'react';
import { getMaskList } from './utils';

interface MaskListProps {
  mask: number;
}

export const MaskList: FunctionComponent<MaskListProps> = ({ mask }) => {
  const masks = useMemo(() => getMaskList(mask), [mask]);

  return (
    <Grid container spacing={1} marginTop={0.5}>
      {masks.map((m) => (
        <Grid key={m} item xs="auto">
          <Chip label={m} size="small" />
        </Grid>
      ))}
    </Grid>
  );
};

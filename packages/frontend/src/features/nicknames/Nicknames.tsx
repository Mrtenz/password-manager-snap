import { List, Typography } from '@mui/material';
import type { FunctionComponent } from 'react';
import { useGetNicknamesQuery } from '../../api';
import { Backup } from './Backup';
import { Nickname } from './Nickname';

export const Nicknames: FunctionComponent = () => {
  const { data } = useGetNicknamesQuery();

  if (!data) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" marginTop={2}>
        Saved Nicknames
      </Typography>
      <Backup />
      <List>
        {data.names.map(({ name, mask }) => (
          <Nickname key={`${name}-${mask}`} name={name} mask={mask} />
        ))}
      </List>
    </>
  );
};

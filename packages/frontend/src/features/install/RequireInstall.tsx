import { Check, InstallDesktop } from '@mui/icons-material';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { FunctionComponent, ReactNode } from 'react';
import {
  useGetFlaskQuery,
  useGetSnapsQuery,
  useInstallSnapMutation,
} from '../../api';
import { SNAP_ID } from '../../constants';

export interface RequireFlaskProps {
  children: ReactNode;
}

export const RequireInstall: FunctionComponent<RequireFlaskProps> = ({
  children,
}) => {
  const [installSnap, { isLoading, isSuccess }] = useInstallSnapMutation();

  const { data: isFlask } = useGetFlaskQuery(undefined, {
    pollingInterval: 1000,
  });

  const { data: installedSnaps } = useGetSnapsQuery(undefined, {
    pollingInterval: 1000,
  });

  const isInstalled =
    isSuccess &&
    installedSnaps &&
    Object.keys(installedSnaps).includes(SNAP_ID) &&
    !installedSnaps[SNAP_ID].error;

  if (isFlask && isInstalled) {
    return <>{children}</>;
  }

  return (
    <>
      <Typography marginTop={2}>
        In order to use this application, you must be using MetaMask Flask, and
        have installed the Password Snap. Use the buttons below to get started.
      </Typography>
      <Stack direction="row" marginTop={2} spacing={1}>
        <Button
          variant="contained"
          startIcon={isFlask ? <Check /> : <InstallDesktop />}
          disabled={isFlask}
          href="https://metamask.io/flask/"
        >
          Install Flask
        </Button>
        <Button
          variant="contained"
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : isInstalled ? (
              <Check />
            ) : (
              <InstallDesktop />
            )
          }
          disabled={isInstalled}
          onClick={() => installSnap()}
        >
          Install Snap
        </Button>
      </Stack>
    </>
  );
};

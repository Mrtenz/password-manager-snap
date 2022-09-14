import { isState } from '@mrtenz/password-snap-common';
import { Download, Upload } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import type { ChangeEvent, FunctionComponent } from 'react';
import { useEffect, useState } from 'react';
import { useGetNicknamesQuery, useImportNicknamesMutation } from '../../api';

export const Backup: FunctionComponent = () => {
  const { data } = useGetNicknamesQuery();
  const [importNicknames] = useImportNicknamesMutation();
  const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    if (data?.names?.length) {
      setBlob(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    }
  }, [data?.names?.length]);

  const hasNicknames = Boolean(data?.names?.length);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      const result = event.target?.result as string;
      console.log(result);

      if (!isState(JSON.parse(result))) {
        return;
      }

      importNicknames(JSON.parse(result));
    });

    reader.readAsText(file);
  };

  return (
    <Stack direction="row" spacing={1} marginTop={2}>
      <a
        href={blob ? URL.createObjectURL(blob) : undefined}
        download={blob ? 'nicknames.json' : undefined}
        style={{ textDecoration: 'none' }}
      >
        <Button
          variant="outlined"
          startIcon={<Download />}
          disabled={!hasNicknames}
        >
          Export
        </Button>
      </a>
      <Button variant="outlined" component="label" startIcon={<Upload />}>
        Import
        <input
          type="file"
          accept="application/json"
          hidden
          onChange={handleUpload}
        />
      </Button>
    </Stack>
  );
};

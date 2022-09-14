import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useGeneratePasswordMutation } from '../../api';
import { RequireInstall } from '../install';
import { MaskSelector } from '../mask';
import { Nicknames } from '../nicknames';

interface FormState {
  name: string;
}

export const App: FunctionComponent = () => {
  const [generatePassword] = useGeneratePasswordMutation();
  const [mask, setMask] = useState(0b11100000);

  const handleGenerate = (name: string) => {
    generatePassword({ name, mask });
  };

  return (
    <Box paddingTop={8} paddingBottom={8}>
      <Container maxWidth="sm">
        <Typography variant="h2">Password Snap</Typography>
        <RequireInstall>
          <Typography marginTop={2}>
            To get started, enter a nickname for your password below, and click
            "Generate".
          </Typography>
          <FormContainer<FormState>
            defaultValues={{ name: '' }}
            onSuccess={({ name }) => handleGenerate(name)}
          >
            <Stack direction="row" spacing={1} marginTop={2}>
              <TextFieldElement
                name="name"
                label="Nickname"
                variant="outlined"
                sx={{ flexGrow: 1 }}
                required
              />
              <Button type="submit" variant="contained">
                Generate
              </Button>
            </Stack>
          </FormContainer>

          <MaskSelector onChange={setMask} />
          <Nicknames />
        </RequireInstall>
      </Container>
    </Box>
  );
};

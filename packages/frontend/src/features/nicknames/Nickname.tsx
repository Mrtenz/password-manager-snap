import { Delete } from '@mui/icons-material';
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import type { FunctionComponent } from 'react';
import {
  useGeneratePasswordMutation,
  useRemoveNicknameMutation,
} from '../../api';
import { MaskList } from '../mask';

export interface NicknameProps {
  name: string;
  mask: number;
}

export const Nickname: FunctionComponent<NicknameProps> = ({ name, mask }) => {
  const [generatePassword] = useGeneratePasswordMutation();
  const [removeNickname] = useRemoveNicknameMutation();

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => removeNickname({ name, mask })}
        >
          <Delete />
        </IconButton>
      }
    >
      <ListItemButton onClick={() => generatePassword({ name, mask })}>
        <ListItemText
          primary={<Typography>{name}</Typography>}
          secondary={<MaskList mask={mask} />}
          disableTypography={true}
        />
      </ListItemButton>
    </ListItem>
  );
};

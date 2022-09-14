import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { getSetMask, Mask, MASKS } from './utils';

interface MaskSelectorProps {
  onChange?: (setMask: number) => void;
}

export const MaskSelector: FunctionComponent<MaskSelectorProps> = ({
  onChange,
}) => {
  const [checked, setChecked] = useState<Mask[]>([
    Mask.Lowercase,
    Mask.Uppercase,
    Mask.Numbers,
  ]);

  const handleToggle = (value: Mask) => {
    if (checked.includes(value)) {
      return setChecked(checked.filter((mask) => mask !== value));
    }

    setChecked([...checked, value]);
  };

  useEffect(() => {
    onChange?.(getSetMask(checked));
  }, [checked]);

  return (
    <List>
      {[...MASKS].reverse().map(({ name }) => (
        <ListItem key={name} disablePadding={true} dense={true}>
          <ListItemButton onClick={() => handleToggle(name)} dense={true}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.includes(name)}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

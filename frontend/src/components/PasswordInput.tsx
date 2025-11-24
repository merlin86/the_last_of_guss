import { type MouseEvent, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export interface PasswordInputProps {
  id: string;
  label: string;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  required?: boolean;
  maxLength?: number;
  show_password_label?: string;
  hide_password_label?: string;
}

export default function PasswordInput(props: PasswordInputProps) {
  const full_width = props.fullWidth ?? true;
  const margin = props.margin ?? 'normal';
  const required = props.required ?? false;
  const show_password_label = props.show_password_label ?? 'Показать пароль';
  const hide_password_label = props.hide_password_label ?? 'Скрыть пароль';

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => { setShowPassword((show) => !show); };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" fullWidth={full_width} margin={margin} required={required}>
      <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
      <OutlinedInput
        id={props.id}
        label={props.label}
        type={showPassword ? 'text' : 'password'}
        inputProps={{ maxLength: props.maxLength }}
        endAdornment={
        <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? hide_password_label : show_password_label
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        />
    </FormControl>
  );
}

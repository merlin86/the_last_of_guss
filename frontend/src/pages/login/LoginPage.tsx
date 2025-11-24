import { type FormEvent, useState } from 'react';
import Alert from '@mui/material/Alert';
import BoxWithTitle from '../../components/BoxWithTitle';
import Button from '@mui/material/Button';
import { Collapse } from '@mui/material';
import Container from '@mui/material/Container';
import { login } from '../../external/backend';
import PasswordInput from '../../components/PasswordInput';
import TextField from '@mui/material/TextField';
import { useUserDispatch } from '../../providers/UserContext';

export default function LoginPage() {
  const userDispatch = useUserDispatch();

  const [dataSent, setDataSent] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const onFromSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDataSent(true);

    const data: { name: string; password: string } = {
      name: (event.currentTarget.elements.namedItem('user-name') as HTMLInputElement).value,
      password: (event.currentTarget.elements.namedItem('user-password') as HTMLInputElement).value,
    };

    login(data.name, data.password).then((response) => {
      userDispatch({ type: 'login', token: response.data!.token });
      setErrorVisible(false);
      setDataSent(false);
    }).catch((error: unknown) => {
      console.error(error);
      userDispatch({ type: 'logout' });
      setErrorVisible(true);
      setDataSent(false);
    });
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <BoxWithTitle title="Войти" content_component="main">
        <form onSubmit={onFromSubmit}>
            <TextField
              id="user-name"
              label="Имя пользователя"
              fullWidth
              margin="normal"
              required
              slotProps={{ htmlInput: { maxLength: 255 } }}
              />
            <PasswordInput id="user-password" label="Пароль" fullWidth margin="normal" required maxLength={255} />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: 2 }}
              disabled={dataSent}>
                Войти
            </Button>
            <Collapse in={errorVisible}>
              <Alert severity='error' variant='filled' sx={{ marginTop: 2 }}>
                Неправильное имя пользователя или пароль
              </Alert>
            </Collapse>
          </form>
      </BoxWithTitle>
    </Container>
  );
}

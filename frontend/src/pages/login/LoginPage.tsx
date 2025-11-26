import Alert from '@mui/material/Alert';
import BoxWithTitle from '../../components/BoxWithTitle';
import Button from '@mui/material/Button';
import { Collapse } from '@mui/material';
import Container from '@mui/material/Container';
import { type FormEvent } from 'react';
import { login } from '../../external/backend';
import PasswordInput from '../../components/PasswordInput';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useUserDispatch } from '../../providers/UserContext';

export default function LoginPage() {
  const navigate = useNavigate();

  const userDispatch = useUserDispatch();

  const doLogin = useMutation({
    mutationFn: async (data: { name: string; password: string }) => {
      const response = await login(data.name, data.password);
      if (response.status === 'OK' && response.data) {
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Unknown error');
      }
    },
    onSuccess: (data) => {
      userDispatch({ type: 'login', token: data.token });
      void navigate('/');
    },
  });

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: { name: string; password: string } = {
      name: (event.currentTarget.elements.namedItem('user-name') as HTMLInputElement).value,
      password: (event.currentTarget.elements.namedItem('user-password') as HTMLInputElement).value,
    };

    doLogin.mutate(data);
  };

  return (
    <Container maxWidth='sm' sx={{ marginTop: 4 }}>
      <BoxWithTitle title='Войти' content_component='main'>
        <form onSubmit={onFormSubmit}>
          <TextField
            id='user-name'
            label='Имя пользователя'
            fullWidth
            margin='normal'
            required
            slotProps={{ htmlInput: { maxLength: 255 } }}
            />
          <PasswordInput id='user-password' label='Пароль' fullWidth margin='normal' required maxLength={255} />
          <Button
            variant='contained'
            color='primary'
            type='submit'
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={doLogin.isPending}>
              Войти
          </Button>
          <Collapse in={doLogin.isError}>
            <Alert severity='error' variant='filled' sx={{ marginTop: 2 }}>
              Неправильное имя пользователя или пароль
            </Alert>
          </Collapse>
        </form>
      </BoxWithTitle>
    </Container>
  );
}

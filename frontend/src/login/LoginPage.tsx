import { type FormEvent, useState } from 'react';
import BoxWithTitle from '../components/BoxWithTitle';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import PasswordInput from '../components/PasswordInput';
import TextField from '@mui/material/TextField';

export default function LoginPage() {
  const [dataSent, setDataSent] = useState(false);

  const onFromSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDataSent(true);

    const data: { name: string; password: string } = {
      name: (event.currentTarget.elements.namedItem('user-name') as HTMLInputElement).value,
      password: (event.currentTarget.elements.namedItem('user-password') as HTMLInputElement).value,
    };

    console.log(data);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <BoxWithTitle title="Войти" content_component="main">
        <form onSubmit={onFromSubmit}>
            <TextField id="user-name" label="Имя пользователя" fullWidth margin='normal' required />
            <PasswordInput id="user-password" label="Пароль" fullWidth margin='normal' required />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: 2 }}
              disabled={dataSent}>
                Войти
            </Button>
          </form>
      </BoxWithTitle>
    </Container>
  );
}

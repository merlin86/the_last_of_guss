/* eslint-disable @typescript-eslint/no-unused-vars */
import BoxWithTitle from '../../components/BoxWithTitle';
import Container from '@mui/material/Container';
import Goose from './Goose';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useUser, useUserDispatch } from '../../providers/UserContext';

export default function RoundPage() {
  const navigate = useNavigate();
  const params = useParams<{ round_id: string }>();

  const user = useUser();
  const userDispatch = useUserDispatch();

  // if not logged in, redirect to login page
  useEffect(() => {
    if (!user) {
      void navigate('/login');
    }
  }, [navigate, user]);

  const onGooseClick = () => {
    console.log('Goose clicked!');
  }

  return (
    <Container maxWidth="md">
      <BoxWithTitle title='Раунды' secondary={user?.name} content_component='main'>
        <Goose clickable onClick={onGooseClick} />
      </BoxWithTitle>
    </Container>
  );
}

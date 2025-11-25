import Brightness1 from '@mui/icons-material/Brightness1';
import { DateTime } from 'luxon';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { type RoundResponse } from '../../external/backend';
import Typography from '@mui/material/Typography';

export interface RoundViewProps {
  round: RoundResponse;
}

export default function RoundView(props: RoundViewProps) {
  const start: string = DateTime
    .fromISO(props.round.round_start, { zone: 'utc' })
    .toLocal()
    .toFormat('dd.MM.yyyy, HH:mm:ss');
  const end: string = DateTime
    .fromISO(props.round.round_end, { zone: 'utc' })
    .toLocal()
    .toFormat('dd.MM.yyyy, HH:mm:ss');
  
  let status = '';
  switch (props.round.status) {
    case 'active':
      status = 'Активен';
      break;
    case 'completed':
      status = 'Завершен';
      break;
    case 'cooldown':
      status = 'Cooldown';
  }

  return (
    <Paper sx={{
      marginTop: 2,
      cursor: 'pointer',
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: (theme) => `0 0 8px ${theme.palette.primary.main}`,
      }
    }}>
      <Grid container spacing={2} padding={2}>
        <Grid size={{ sm: 2, md: 1 }}>
          <Brightness1 />
        </Grid>
        <Grid size={{ sm: 10, md: 11 }}>
          <Typography component='h1' sx={{ display: 'flex', alignItems: 'center' }}>
            {`Round ID: ${props.round.round_id}`}
          </Typography>
        </Grid>
        <Grid size={{ sm: 2, md: 1 }}>
          <Typography component='p'>
            Start:
          </Typography>
        </Grid>
        <Grid size={{ sm: 10, md: 11 }}>
          <Typography component='p'>
            {start}
          </Typography>
        </Grid>
        <Grid size={{ sm: 2, md: 1 }}>
          <Typography component='p'>
            End:
          </Typography>
        </Grid>
        <Grid size={{ sm: 10, md: 11 }}>
          <Typography component='p'>
            {end}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={{ sm: 2, md: 1 }}>
          <Typography component='p'>
            Status:
          </Typography>
        </Grid>
        <Grid size={{ sm: 10, md: 11 }}>
          <Typography component='p'>
            {status}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

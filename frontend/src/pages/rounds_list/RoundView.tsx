import Brightness1 from '@mui/icons-material/Brightness1';
import { DateTime } from 'luxon';
import Divider from '@mui/material/Divider';
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
    <Paper sx={{ marginTop: 2 }}>
      <Typography component='h1' sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <Brightness1 sx={{ marginRight: 2 }}/>
        {`Round ID: ${props.round.round_id}`}
      </Typography>
      <Typography component='p' sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {`Start: ${start}`}
      </Typography>
      <Typography component='p' sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {`End: ${end}`}
      </Typography>
      <Divider sx={{ marginTop: 2 }}/>
      <Typography component='p' sx={{ padding: 2 }}>
        {`Status: ${status}`}
      </Typography>
    </Paper>
  );
}

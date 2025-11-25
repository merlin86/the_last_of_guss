import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import type { RoundExtendedResponse } from '../../external/backend';
import Typography from '@mui/material/Typography';

export interface FinishedRoundInfoProps {
  round: RoundExtendedResponse;
}

export default function FinishedRoundInfo(props: FinishedRoundInfoProps) {
  return (
    <Grid container spacing={2} padding={1}>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={{ xs: 10, sm: 11 }}>
        <Typography component='p'>Всего</Typography>
      </Grid>
      <Grid size={{ xs: 2, sm: 1 }}>
        <Typography component='p'>{props.round.total_score}</Typography>
      </Grid>
      <Grid size={{ xs: 10, sm: 11 }}>
        <Typography component='p'>{`Победитель - ${props.round.winner_name ?? ''}`}</Typography>
      </Grid>
      <Grid size={{ xs: 2, sm: 1 }}>
        <Typography component='p'>{props.round.winner_score}</Typography>
      </Grid>
      <Grid size={{ xs: 10, sm: 11 }}>
        <Typography component='p'>Мои очки</Typography>
      </Grid>
      <Grid size={{ xs: 2, sm: 1 }}>
        <Typography component='p'>{props.round.my_score}</Typography>
      </Grid>
    </Grid>
  );
}

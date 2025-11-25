import Container from '@mui/material/Container';
import { DateTime } from 'luxon';
import type { RoundExtendedResponse } from '../../external/backend';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

function computeTimeToStart(round_start: string): string {
  const time_to_start = DateTime.fromISO(round_start, { zone: 'utc' })
    .toLocal()
    .diff(DateTime.now())
    .shiftTo('minutes', 'seconds');

  return time_to_start.toFormat('mm:ss');
}

export interface CooldownRoundInfoProps {
  round: RoundExtendedResponse;
}

export default function CooldownRoundInfo(props: CooldownRoundInfoProps) {
  const [timeToStart, setTimeToStart] = useState(() => computeTimeToStart(props.round.round_start));

  // Update time to start every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToStart(computeTimeToStart(props.round.round_start));
    }, 1000);

    return () => { clearInterval(interval); };
  }, [props.round.round_start]);

  return (
    <Container sx={{ paddingTop: 2, textAlign: 'center' }}>
      <Typography component='p'>Cooldown</Typography>
      <Typography component='p'>
        до начала раунда {timeToStart}
      </Typography>
    </Container>
  );
}

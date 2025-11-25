import Container from '@mui/material/Container';
import { DateTime } from 'luxon';
import type { RoundExtendedResponse } from '../../external/backend';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

function computeTimeToEnd(round_end: string): string {
  const time_to_end = DateTime.fromISO(round_end, { zone: 'utc' })
    .toLocal()
    .diff(DateTime.now())
    .shiftTo('minutes', 'seconds');

  return time_to_end.toFormat('mm:ss');
}

export interface ActiveRoundInfoProps {
  round: RoundExtendedResponse;
  score: number;
}

export default function ActiveRoundInfo(props: ActiveRoundInfoProps) {
  const [timeToEnd, setTimeToEnd] = useState(() => computeTimeToEnd(props.round.round_end));

  // Update time to end every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToEnd(computeTimeToEnd(props.round.round_end));
    }, 1000);

    return () => { clearInterval(interval); };
  }, [props.round.round_end]);

  return (
    <Container sx={{ paddingTop: 2, textAlign: 'center' }}>
      <Typography component='p'>Раунд активен!</Typography>
      <Typography component='p'>
        До конца раунда осталось: {timeToEnd}
      </Typography>
      <Typography component='p'>Мои очки - {props.score}</Typography>
    </Container>
  );
}

import BangSvg from './assets/bang.svg';
import Box from '@mui/material/Box';
import GooseSvg from './assets/goose.svg';
import GooseKickedSvg from './assets/goose_kicked.svg';
import { useEffect, useRef, useState } from 'react';

const KICK_DURATION_MS = 1000;

interface BangAnimation {
  id: number;
  created_at: number;
  x: number;
  y: number;
}

export interface GooseProps {
  clickable?: boolean;
  onClick?: () => void;
}

export default function Goose(props: GooseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isClicked, setIsClicked] = useState(false);
  const clickedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [bangs, setBangs] = useState<BangAnimation[]>([]);
  const bangIdCounter = useRef(0);

  // cleanup expired bangs
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setBangs(prev => prev.filter(bang => now - bang.created_at < KICK_DURATION_MS));
    }, KICK_DURATION_MS / 10);

    return () => { clearInterval(interval); };
  }, []);

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!props.clickable) {
      return;
    }

    // calling external onClick if provided
    if (props.onClick) {
      props.onClick();
    }

    // updating goose state
    setIsClicked(true);
    if (clickedTimeoutRef.current) {
      clearTimeout(clickedTimeoutRef.current);
    }
    clickedTimeoutRef.current = setTimeout(() => {
      setIsClicked(false);
    }, KICK_DURATION_MS);

    // adding new bang
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - 25; // centering (50px / 2)
      const y = event.clientY - rect.top - 25;  // centering (50px / 2)
      
      const bangId = bangIdCounter.current++;
      const newBang: BangAnimation = { 
        id: bangId,
        created_at: Date.now(),
        x, 
        y,  
      };

      setBangs(prev => [...prev, newBang]);
    }
  };
  
  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', display: 'inline-block' }}
      onClick={onClick}
    >
      <img
        src={isClicked ? GooseKickedSvg : GooseSvg}
        alt={isClicked ? 'Пинок гуся' : 'Гусь'}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      {/* rendering bangs */}
      {bangs.map(bang => (
        <img
          key={bang.id}
          src={BangSvg}
          alt="Bang!"
          style={{
            position: 'absolute',
            left: bang.x,
            top: bang.y,
            width: 50,
            height: 50,
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      ))}
    </Box>
  );
}

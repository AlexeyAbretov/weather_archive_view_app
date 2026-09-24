import type { PrecipitationType } from '@domain';

import styles from './WeatherIcon.module.css';
import type {
  PrecipitationIntensity,
  SkyKind,
  WeatherPictureModel,
} from './WeatherIcon.types';

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

const markScale = (intensity: PrecipitationIntensity): number => {
  if (intensity === 'light') {
    return 0.75;
  }

  if (intensity === 'moderate') {
    return 1;
  }

  return 1.2;
};

const markPositions = (
  precipitation: PrecipitationType,
  intensity: PrecipitationIntensity,
): number[] => {
  if (precipitation === 'drizzle') {
    if (intensity === 'light') {
      return [12, 20];
    }

    if (intensity === 'moderate') {
      return [8, 13, 19, 24];
    }

    return [6, 11, 16, 21, 26];
  }

  if (precipitation === 'mixed') {
    if (intensity === 'light') {
      return [12, 20];
    }

    if (intensity === 'moderate') {
      return [8, 16, 24];
    }

    return [6, 12, 18, 24];
  }

  if (intensity === 'light') {
    return [16];
  }

  if (intensity === 'moderate') {
    return [11, 21];
  }

  return [7, 16, 25];
};

const Sun = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
  return (
    <g stroke="#faad14" strokeLinecap="round" strokeWidth="1.4">
      <circle cx={cx} cy={cy} fill="#faad14" r={r} stroke="none" />
      {RAYS.map((angle) => (
        <line
          key={angle}
          transform={`rotate(${angle} ${cx} ${cy})`}
          x1={cx}
          x2={cx}
          y1={cy - r - 1}
          y2={cy - r - 3.2}
        />
      ))}
    </g>
  );
};

const CLOUD_PATH = [
  'M9 18.2c0-2.4 1.8-4.2 4.2-4.2.5-2.2 2.5-3.8',
  '4.8-3.8 2 0 3.7 1.1 4.5 2.7 2 .2 3.5 1.8',
  '3.5 3.9 0 2.2-1.8 4-4 4H12.2c-2.1 0-3.2-1.4-3.2-2.6z',
].join(' ');

const Cloud = () => {
  return (
    <path d={CLOUD_PATH} fill="#f5f5f5" stroke="#8c8c8c" strokeWidth="1.2" />
  );
};

const Sky = ({ compact, kind }: { compact: boolean; kind: SkyKind }) => {
  const shift = compact ? 'translate(0 -4)' : undefined;

  return (
    <g transform={shift}>
      {kind === 'clear' ? <Sun cx={16} cy={14} r={5} /> : null}
      {kind === 'partly' ? (
        <>
          <Sun cx={12} cy={11} r={3.4} />
          <Cloud />
        </>
      ) : null}
      {kind === 'overcast' ? <Cloud /> : null}
      {kind === 'fog' ? (
        <g stroke="#bfbfbf" strokeLinecap="round" strokeWidth="1.7">
          <line x1="6" x2="26" y1="11" y2="11" />
          <line x1="9" x2="23" y1="16" y2="16" />
          <line x1="6" x2="26" y1="21" y2="21" />
        </g>
      ) : null}
      {kind === 'unknown' ? (
        <g fill="none" stroke="#bfbfbf" strokeWidth="1.4">
          <circle cx="16" cy="14" r="7" />
          <text
            fill="#bfbfbf"
            fontSize="12"
            stroke="none"
            textAnchor="middle"
            x="16"
            y="18"
          >
            ?
          </text>
        </g>
      ) : null}
    </g>
  );
};

const DROP_PATH = [
  'M0 0c1.5 2 2.4 3.1 2.4 4.5C2.4 6.2 1.3 7.2',
  '0 7.2S-2.4 6.2-2.4 4.5C-2.4 3.1-1.5 2 0 0z',
].join(' ');

const Drop = ({ icy }: { icy: boolean }) => {
  return (
    <g>
      <path d={DROP_PATH} fill={icy ? '#91caff' : '#1677ff'} />
      {icy ? <path d="M0 3.2 1.1 4.4 0 5.6-1.1 4.4z" fill="#f0f5ff" /> : null}
    </g>
  );
};

const Flake = () => {
  return (
    <g fill="none" stroke="#69b1ff" strokeLinecap="round" strokeWidth="1.2">
      <line x1="-3" x2="3" y1="3" y2="3" />
      <line x1="0" x2="0" y1="0" y2="6" />
      <line x1="-2.2" x2="2.2" y1="1.2" y2="4.8" />
      <line x1="-2.2" x2="2.2" y1="4.8" y2="1.2" />
    </g>
  );
};

const Bolt = () => {
  return <path d="M1.2-5.5-2 0.4h2.2L-1 5.5 3.6-.4H1.4z" fill="#722ed1" />;
};

const Pellet = () => {
  return (
    <g>
      <circle cx="0" cy="3" fill="#595959" r="2.3" />
      <circle cx="-0.6" cy="2.3" fill="#f5f5f5" r="0.7" />
    </g>
  );
};

const Dot = () => {
  return <circle cx="0" cy="3.2" fill="#1677ff" r="1.15" />;
};

const Mark = ({
  icy,
  index,
  precipitation,
}: {
  icy: boolean;
  index: number;
  precipitation: PrecipitationType;
}) => {
  const flake =
    precipitation === 'snow' || (precipitation === 'mixed' && index % 2 === 1);

  if (flake) {
    return <Flake />;
  }

  if (precipitation === 'thunderstorm') {
    return <Bolt />;
  }

  if (precipitation === 'hail') {
    return <Pellet />;
  }

  if (precipitation === 'drizzle') {
    return <Dot />;
  }

  return <Drop icy={icy} />;
};

const PrecipitationMarks = ({
  intensity,
  precipitation,
}: {
  intensity: PrecipitationIntensity;
  precipitation: PrecipitationType;
}) => {
  if (precipitation === 'none') {
    return null;
  }

  const scale = markScale(intensity);
  const icy = precipitation === 'freezing_rain';

  return (
    <>
      {markPositions(precipitation, intensity).map((x, index) => (
        <g
          key={`${precipitation}-${x}`}
          transform={`translate(${x} 22) scale(${scale})`}
        >
          <Mark icy={icy} index={index} precipitation={precipitation} />
        </g>
      ))}
    </>
  );
};

export const WeatherPicture = ({
  intensity,
  precipitation,
  sky,
}: WeatherPictureModel) => {
  return (
    <svg
      aria-hidden
      className={styles.picture}
      data-intensity={precipitation === 'none' ? undefined : intensity}
      data-precipitation={precipitation}
      data-sky={sky}
      viewBox="0 0 32 32"
    >
      <Sky compact={precipitation !== 'none'} kind={sky} />
      <PrecipitationMarks intensity={intensity} precipitation={precipitation} />
    </svg>
  );
};

import type { PrecipitationType } from '@domain';

import styles from './WeatherIcon.module.css';
import type {
  PrecipitationIntensity,
  SkyKind,
  WeatherPictureModel,
} from './WeatherIcon.types';

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

const MARK_Y = 22.5;

const markScale = (
  intensity: PrecipitationIntensity,
  precipitation: PrecipitationType,
): number => {
  if (precipitation === 'drizzle') {
    if (intensity === 'light') {
      return 0.9;
    }

    if (intensity === 'moderate') {
      return 1.15;
    }

    return 1.35;
  }

  if (intensity === 'light') {
    return 0.8;
  }

  if (intensity === 'moderate') {
    return 1.05;
  }

  return 1.2;
};

const markPositions = (
  precipitation: PrecipitationType,
  intensity: PrecipitationIntensity,
): number[] => {
  if (precipitation === 'drizzle') {
    if (intensity === 'light') {
      return [13, 19];
    }

    if (intensity === 'moderate') {
      return [11, 14.5, 18, 21.5];
    }

    return [10.5, 13.7, 16.9, 20.1, 23.3];
  }

  if (precipitation === 'mixed') {
    if (intensity === 'light') {
      return [13, 19];
    }

    if (intensity === 'moderate') {
      return [12, 16, 20];
    }

    return [12, 16.5, 21];
  }

  if (intensity === 'light') {
    return [16];
  }

  if (intensity === 'moderate') {
    return [13, 19];
  }

  return [9.5, 16, 22.5];
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

const CLOUD_CX = 17.5;
const CLOUD_CY = 15.5;

const placeAt = (scale: number, x: number, y: number): string => {
  const originX = -CLOUD_CX;
  const originY = -CLOUD_CY;

  return [
    `translate(${x} ${y})`,
    `scale(${scale})`,
    `translate(${originX} ${originY})`,
  ].join(' ');
};

const FogLines = () => {
  return (
    <g stroke="#bfbfbf" strokeLinecap="round" strokeWidth="1.4">
      <line x1="6" x2="26" y1="11" y2="11" />
      <line x1="9" x2="23" y1="16" y2="16" />
      <line x1="6" x2="26" y1="21" y2="21" />
    </g>
  );
};

const UnknownMark = ({ cy }: { cy: number }) => {
  return (
    <g fill="none" stroke="#bfbfbf" strokeWidth="1.4">
      <circle cx="16" cy={cy} r="9" />
      <text
        fill="#bfbfbf"
        fontSize="14"
        stroke="none"
        textAnchor="middle"
        x="16"
        y={cy + 5}
      >
        ?
      </text>
    </g>
  );
};

const Sky = ({ compact, kind }: { compact: boolean; kind: SkyKind }) => {
  if (kind === 'overcast') {
    const transform = compact ? placeAt(1.4, 16, 12.5) : placeAt(1.5, 16, 16);

    return (
      <g transform={transform}>
        <Cloud />
      </g>
    );
  }

  if (kind === 'clear') {
    return compact ? (
      <Sun cx={16} cy={11} r={6.2} />
    ) : (
      <Sun cx={16} cy={16} r={7.5} />
    );
  }

  if (kind === 'mainly') {
    return (
      <>
        <Sun cx={13} cy={compact ? 11.5 : 16} r={compact ? 5.8 : 6.5} />
        <g transform={compact ? placeAt(0.62, 22, 12) : placeAt(0.68, 22, 16)}>
          <Cloud />
        </g>
      </>
    );
  }

  if (kind === 'partly') {
    const transform = compact ? placeAt(1.3, 16, 13.5) : placeAt(1.3, 16, 16);

    return (
      <g transform={transform}>
        <Sun cx={14} cy={13} r={3.8} />
        <Cloud />
      </g>
    );
  }

  if (kind === 'fog') {
    const transform = compact
      ? 'translate(16 13) scale(1.25) translate(-16 -16)'
      : 'translate(16 16) scale(1.35) translate(-16 -16)';

    return (
      <g transform={transform}>
        <FogLines />
      </g>
    );
  }

  return <UnknownMark cy={compact ? 12 : 16} />;
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
  return <circle cx="0" cy="1.15" fill="#1677ff" r="1.15" />;
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

  const scale = markScale(intensity, precipitation);
  const icy = precipitation === 'freezing_rain';

  return (
    <>
      {markPositions(precipitation, intensity).map((x, index) => (
        <g
          key={`${precipitation}-${x}`}
          transform={`translate(${x} ${MARK_Y}) scale(${scale})`}
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

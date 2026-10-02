import { useId } from 'react';

import styles from './YearColumnsTable.module.css';
import type { StepChartBand, StepChartProps } from './YearColumnsTable.types';

const hasTemperatureGradient = (
  band: StepChartBand,
): band is StepChartBand & { fillTop: string; fillBottom: string } => {
  return (
    band.fillTop != null &&
    band.fillBottom != null &&
    band.fillTop !== band.fillBottom
  );
};

const topStroke = (band: StepChartBand): string => {
  return band.strokeTop ?? band.stroke;
};

const bottomStroke = (band: StepChartBand): string => {
  return band.strokeBottom ?? band.stroke;
};

export const YearColumnsStepChart = ({ chart }: StepChartProps) => {
  const chartId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const columnCount = chart.segments.length;
  const gradientId = (key: string): string => {
    return `${chartId}-${key}`;
  };

  const gradientBands = chart.segments.flatMap((segment) => {
    if (!segment.band || !hasTemperatureGradient(segment.band)) {
      return [];
    }

    return [{ key: segment.key, band: segment.band }];
  });

  return (
    <div className={styles.chart} style={{ height: chart.height }}>
      <svg
        aria-hidden="true"
        className={styles.plot}
        height={chart.height}
        preserveAspectRatio="none"
        viewBox={`0 0 ${columnCount} ${chart.height}`}
        width="100%"
      >
        {gradientBands.length > 0 ? (
          <defs>
            {gradientBands.map(({ key, band }) => (
              <linearGradient
                key={`gradient-${key}`}
                gradientUnits="userSpaceOnUse"
                id={gradientId(key)}
                x1="0"
                x2="0"
                y1={band.top + band.height}
                y2={band.top}
              >
                <stop offset="0" stopColor={band.fillBottom} />
                <stop offset="1" stopColor={band.fillTop} />
              </linearGradient>
            ))}
          </defs>
        ) : null}
        {chart.segments.map((segment, index) => {
          if (!segment.isAnchor) {
            return null;
          }

          return (
            <rect
              key={`anchor-${segment.key}`}
              fill="#fff7e6"
              height={chart.height}
              width={1}
              x={index}
              y={0}
            />
          );
        })}
        {chart.segments.map((segment, index) => {
          if (!segment.band) {
            return null;
          }

          return (
            <rect
              key={`band-${segment.key}`}
              data-band="true"
              fill={
                hasTemperatureGradient(segment.band)
                  ? `url(#${gradientId(segment.key)})`
                  : segment.band.fill
              }
              height={segment.band.height}
              width={1}
              x={index}
              y={segment.band.top}
            />
          );
        })}
        {chart.segments.map((segment, index) => {
          if (!segment.band) {
            return null;
          }

          const next = chart.segments[index + 1];
          const bottom = segment.band.top + segment.band.height;

          return (
            <g key={`stroke-${segment.key}`}>
              <line
                stroke={topStroke(segment.band)}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                x1={index}
                x2={index + 1}
                y1={segment.band.top}
                y2={segment.band.top}
              />
              <line
                stroke={bottomStroke(segment.band)}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                x1={index}
                x2={index + 1}
                y1={bottom}
                y2={bottom}
              />
              {next?.band ? (
                <g data-join="true">
                  <line
                    stroke={topStroke(segment.band)}
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    x1={index + 1}
                    x2={index + 1}
                    y1={segment.band.top}
                    y2={next.band.top}
                  />
                  <line
                    stroke={bottomStroke(segment.band)}
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    x1={index + 1}
                    x2={index + 1}
                    y1={bottom}
                    y2={next.band.top + next.band.height}
                  />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className={styles.labels}>
        {chart.segments.map((segment) => (
          <div
            key={segment.key}
            className={styles.column}
            title={segment.tooltip}
          >
            {segment.band ? (
              segment.labels.map((label) => (
                <span
                  key={`${segment.key}-${label.top}`}
                  className={styles.chartLabel}
                  style={{ top: label.top }}
                >
                  {label.text}
                </span>
              ))
            ) : (
              <span className={styles.emptyLabel}>{segment.emptyLabel}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

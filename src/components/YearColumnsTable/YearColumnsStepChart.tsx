import styles from './YearColumnsTable.module.css';
import type { StepChartProps } from './YearColumnsTable.types';

export const YearColumnsStepChart = ({ chart }: StepChartProps) => {
  const columnCount = chart.segments.length;

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
              fill={segment.band.fill}
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
                stroke={segment.band.stroke}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                x1={index}
                x2={index + 1}
                y1={segment.band.top}
                y2={segment.band.top}
              />
              <line
                stroke={segment.band.stroke}
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
                    stroke={segment.band.stroke}
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    x1={index + 1}
                    x2={index + 1}
                    y1={segment.band.top}
                    y2={next.band.top}
                  />
                  <line
                    stroke={segment.band.stroke}
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

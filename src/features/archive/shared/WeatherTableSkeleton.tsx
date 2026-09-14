import { Skeleton } from 'antd';

type WeatherTableSkeletonProps = {
  columns?: number;
};

export function WeatherTableSkeleton({ columns = 5 }: WeatherTableSkeletonProps) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 0' }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton.Input key={index} active style={{ minWidth: 80, height: 100 }} />
      ))}
    </div>
  );
}

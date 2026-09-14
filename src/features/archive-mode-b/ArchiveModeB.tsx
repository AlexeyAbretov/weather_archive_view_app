import { Typography } from 'antd';
import type { ArchiveModeBProps } from './types';
import { YearRowsTable } from './YearRowsTable';

const { Text } = Typography;

export function ArchiveModeB(props: ArchiveModeBProps) {
  return (
    <div>
      <YearRowsTable {...props} />
      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
        Режим B: раскройте год, чтобы увидеть 15 дней (D−7…D+7). Данные загружаются при раскрытии.
      </Text>
    </div>
  );
}

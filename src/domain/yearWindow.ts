export type ArchiveViewMode = 'A' | 'B';

export type YearWindowSlot = {
  year: number;
  startDate: string | null;
  endDate: string | null;
  unavailable: boolean;
};

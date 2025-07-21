import { IrregularitiesTable } from '@/components/irregularities/irregularities-table';

interface ApartmentIrregularitiesTableProps {
  apartmentId: string;
  isArchive: boolean;
}

export function ApartmentIrregularitiesTable({
  apartmentId,
  isArchive,
}: ApartmentIrregularitiesTableProps) {
  return (
    <IrregularitiesTable
      entityId={apartmentId}
      entityType="apartment"
      isArchive={isArchive}
    />
  );
}

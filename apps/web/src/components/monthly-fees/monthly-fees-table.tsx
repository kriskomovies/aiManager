import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import {
  useGetMonthlyFeesByBuildingQuery,
  useDeleteMonthlyFeeMutation,
} from '@/redux/services/monthly-fee.service';
import { useGetBuildingQuery } from '@/redux/services/building.service';
import { useGetApartmentsByBuildingQuery } from '@/redux/services/apartment.service';
import { useAppDispatch } from '@/redux/hooks';
import { addAlert } from '@/redux/slices/alert-slice';
import { openModal } from '@/redux/slices/modal-slice';
import { FeePaymentBasis } from '@repo/interfaces';

interface MonthlyFeesTableProps {
  buildingId: string;
}

interface MonthlyFeeData {
  id: string;
  name: string;
  apartments: string;
  paymentBase: string;
  applicationMode: string;
  baseAmount: number;
  isActive: boolean;
  targetMonth?: string;
  createdAt: string;
}

export function MonthlyFeesTable({ buildingId }: MonthlyFeesTableProps) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof MonthlyFeeData;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Fetch monthly fees and building data
  const {
    data: monthlyFees = [],
    isLoading,
    error,
  } = useGetMonthlyFeesByBuildingQuery(buildingId);
  const { data: building } = useGetBuildingQuery(buildingId);
  const [deleteMonthlyFee] = useDeleteMonthlyFeeMutation();

  const handleViewFee = (fee: MonthlyFeeData) => {
    dispatch(
      openModal({
        type: 'view-monthly-fee',
        data: {
          monthlyFeeId: fee.id,
        },
      })
    );
  };

  const handleEditFee = (fee: MonthlyFeeData) => {
    console.log('Edit monthly fee:', fee.name);
  };

  const handleDeleteFee = async (fee: MonthlyFeeData) => {
    if (
      window.confirm(`Сигурни ли сте, че искате да изтриете "${fee.name}"?`)
    ) {
      try {
        await deleteMonthlyFee(fee.id).unwrap();
        dispatch(
          addAlert({
            type: 'success',
            title: 'Успешно изтриване!',
            message: `Месечната такса "${fee.name}" беше изтрита успешно.`,
            duration: 5000,
          })
        );
      } catch {
        dispatch(
          addAlert({
            type: 'error',
            title: 'Грешка при изтриване',
            message: 'Възникна грешка при изтриването на месечната такса.',
            duration: 5000,
          })
        );
      }
    }
  };

  // Get total apartment count - use actual apartment count from the building's apartments
  // or fallback to apartmentCount field if apartments query fails
  const { data: apartments = [] } = useGetApartmentsByBuildingQuery(buildingId);
  const totalApartments = apartments.length || building?.apartmentCount || 0;

  // Function to get payment basis badge text
  const getPaymentBaseBadgeText = (paymentBasis: FeePaymentBasis) => {
    const labelMap: Record<FeePaymentBasis, string> = {
      [FeePaymentBasis.APARTMENT]: 'Апартамент',
      [FeePaymentBasis.RESIDENT]: 'Живущ',
      [FeePaymentBasis.PET]: 'Домашно Животно',
      [FeePaymentBasis.COMMON_PARTS]: 'Общи Части',
      [FeePaymentBasis.QUADRATURE]: 'Квадратура',
    };
    return labelMap[paymentBasis] || paymentBasis;
  };

  // Transform API data to table format
  const transformedMonthlyFees: MonthlyFeeData[] = (monthlyFees || []).map(
    fee => ({
      id: fee.id,
      name: fee.name,
      apartments: `${fee.apartments?.length || 0}/${totalApartments}`,
      paymentBase: getPaymentBaseBadgeText(fee.paymentBasis),
      applicationMode: fee.applicationMode,
      baseAmount: fee.baseAmount,
      isActive: fee.isActive ?? true,
      targetMonth: fee.targetMonth,
      createdAt: fee.createdAt,
    })
  );

  const getPaymentBaseBadge = (paymentBase: string) => {
    const colorMap: Record<
      string,
      'positive' | 'neutral' | 'warning' | 'negative'
    > = {
      'Общи Части': 'positive',
      Апартамент: 'neutral',
      Квадратура: 'warning',
      Живущ: 'positive',
      'Домашно Животно': 'negative',
    };

    return (
      <Badge variant={colorMap[paymentBase] || 'neutral'}>{paymentBase}</Badge>
    );
  };

  const columns: Column<MonthlyFeeData>[] = [
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '200px',
      minWidth: '200px',
      cell: row => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      header: 'Апартаменти',
      accessorKey: 'apartments',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => <span className="text-gray-700">{row.apartments}</span>,
    },
    {
      header: 'Плащане на База',
      accessorKey: 'paymentBase',
      sortable: true,
      width: '150px',
      minWidth: '150px',
      cell: row => getPaymentBaseBadge(row.paymentBase),
    },
    {
      header: 'Базова Сума',
      accessorKey: 'baseAmount',
      sortable: true,
      width: '130px',
      minWidth: '130px',
      cell: row => (
        <span className="font-medium text-gray-900">
          {row.baseAmount.toFixed(2)} лв.
        </span>
      ),
    },
    {
      header: 'Статус',
      accessorKey: 'isActive',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <Badge variant={row.isActive ? 'positive' : 'negative'}>
          {row.isActive ? 'Активна' : 'Неактивна'}
        </Badge>
      ),
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewFee(row)}
            className="h-8 w-8 p-0"
            title="Преглед"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditFee(row)}
            className="h-8 w-8 p-0"
            title="Редактиране"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteFee(row)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Изтриване"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const transformedData = {
    items: transformedMonthlyFees,
    meta: {
      pageCount: Math.ceil(transformedMonthlyFees.length / 10),
    },
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Грешка при зареждане на месечните такси</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={transformedData.items}
      isLoading={isLoading}
      isFetching={false}
      error={error}
      page={page}
      pageCount={transformedData.meta.pageCount}
      sorting={sorting}
      onPageChange={setPage}
      onSortingChange={setSorting}
    />
  );
}

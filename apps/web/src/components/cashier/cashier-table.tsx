import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import {
  Wallet,
  Printer,
  MoreVertical,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/slices/modal-slice';
import { useGetApartmentsByBuildingQuery } from '@/redux/services/apartment.service';
import { IApartmentResponse } from '@repo/interfaces';

interface CashierTableProps {
  buildingId: string;
}

interface CashierRecord {
  id: string;
  apartment: string;
  floor: number;
  name: string;
  residentsCount: number;
  elevatorFee: number;
  elevatorElectricity: number;
  subscriptionNumber: string;
  new: number;
  old: number;
  total: number;
}

export function CashierTable({ buildingId }: CashierTableProps) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof CashierRecord;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Fetch apartments for the building
  const {
    data: apartments = [],
    isLoading,
    isFetching,
    error,
  } = useGetApartmentsByBuildingQuery(buildingId);

  // Transform apartment data to cashier records
  const cashierRecords: CashierRecord[] = apartments.map(
    (apartment: IApartmentResponse) => {
      // Get main resident name
      const mainResident =
        apartment.residents?.find(r => r.isMainContact) ||
        apartment.residents?.[0];
      const residentName = mainResident
        ? `${mainResident.name} ${mainResident.surname}`
        : 'Име Фамилия';

      // Mock calculations for fees (in real app, these would come from actual fee calculations)
      const elevatorFee = apartment.floor > 1 ? apartment.floor * 3.0 : 0; // 3 лв per floor above ground
      const elevatorElectricity =
        apartment.floor > 1 ? apartment.floor * 0.5 : 0; // 0.5 лв per floor for electricity

      // Mock readings (in real app, these would come from meter readings)
      const oldReading = Math.floor(Math.random() * 100) + 100; // Random old reading
      const newReading = oldReading + Math.floor(Math.random() * 50) + 10; // New reading is higher
      const total =
        elevatorFee + elevatorElectricity + (newReading - oldReading) * 0.1; // 0.1 лв per unit difference

      return {
        id: apartment.id,
        apartment: apartment.number,
        floor: apartment.floor,
        name: residentName,
        residentsCount: apartment.residentsCount,
        elevatorFee: elevatorFee,
        elevatorElectricity: elevatorElectricity,
        subscriptionNumber: `12345678`, // Mock subscription number
        new: newReading,
        old: oldReading,
        total: total,
      };
    }
  );

  const handleWallet = (recordId: string) => {
    // TODO: Implement wallet functionality
    console.log('Wallet action for apartment:', recordId);
  };

  const handlePrint = (recordId: string) => {
    // TODO: Implement print functionality
    console.log('Print action for apartment:', recordId);
  };

  const handleTaxInquiries = (recordId: string) => {
    // Find the apartment record to get the apartment number
    const apartment = apartments.find(apt => apt.id === recordId);
    const apartmentNumber = apartment?.number || 'Unknown';

    console.log(
      'Tax inquiries for apartment:',
      recordId,
      'Number:',
      apartmentNumber
    );
    dispatch(
      openModal({
        type: 'reference-fees',
        data: {
          apartmentId: recordId,
          apartmentNumber: apartmentNumber,
          buildingId,
        },
      })
    );
  };

  const handlePaymentInquiries = (recordId: string) => {
    // TODO: Open payment inquiries modal
    console.log('Payment inquiries for apartment:', recordId);
    dispatch(
      openModal({
        type: 'edit-apartment-irregularity', // TODO: Create payment-inquiries modal type
        data: { apartmentId: recordId, buildingId },
      })
    );
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} лв.`;
  };

  const getDebtBadge = (amount: number) => {
    if (amount < 0) {
      return (
        <Badge variant="negative">-{formatCurrency(Math.abs(amount))}</Badge>
      );
    } else if (amount > 0) {
      return <Badge variant="positive">{formatCurrency(amount)}</Badge>;
    } else {
      return <Badge variant="neutral">{formatCurrency(amount)}</Badge>;
    }
  };

  const columns: Column<CashierRecord>[] = [
    {
      header: 'Апартамент',
      accessorKey: 'apartment',
      sortable: true,
      searchable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.apartment}</span>
        </div>
      ),
    },
    {
      header: 'Етаж',
      accessorKey: 'floor',
      sortable: true,
      width: '80px',
      minWidth: '80px',
      cell: row => <span className="text-gray-600">{row.floor}</span>,
    },
    {
      header: 'Име',
      accessorKey: 'name',
      sortable: true,
      searchable: true,
      width: '150px',
      minWidth: '150px',
    },
    {
      header: 'Брой Живущи',
      accessorKey: 'residentsCount',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => <span className="text-gray-600">{row.residentsCount}</span>,
    },
    {
      header: 'Такса Асансьор',
      accessorKey: 'elevatorFee',
      sortable: true,
      width: '130px',
      minWidth: '130px',
      cell: row => (
        <span className="text-gray-900 font-medium">
          {formatCurrency(row.elevatorFee)}
        </span>
      ),
    },
    {
      header: 'Ток Асансьор',
      accessorKey: 'elevatorElectricity',
      sortable: true,
      width: '120px',
      minWidth: '120px',
      cell: row => (
        <span className="text-gray-900 font-medium">
          {formatCurrency(row.elevatorElectricity)}
        </span>
      ),
    },
    {
      header: 'Абонаментен Номер',
      accessorKey: 'subscriptionNumber',
      sortable: true,
      width: '150px',
      minWidth: '150px',
      cell: row => (
        <Badge variant="neutral" className="font-mono text-xs">
          {row.subscriptionNumber}
        </Badge>
      ),
    },
    {
      header: 'Ново',
      accessorKey: 'new',
      sortable: true,
      width: '80px',
      minWidth: '80px',
      cell: row => (
        <span className="text-gray-900 font-medium">{row.new.toFixed(2)}</span>
      ),
    },
    {
      header: 'Старо',
      accessorKey: 'old',
      sortable: true,
      width: '80px',
      minWidth: '80px',
      cell: row => <span className="text-gray-600">{row.old.toFixed(2)}</span>,
    },
    {
      header: 'Общо',
      accessorKey: 'total',
      sortable: true,
      width: '100px',
      minWidth: '100px',
      cell: row => getDebtBadge(row.total),
    },
    {
      header: 'Действия',
      accessorKey: 'id',
      width: '160px',
      minWidth: '160px',
      cell: row => {
        const dropdownItems = [
          {
            label: 'Справки Такси',
            onClick: () => handleTaxInquiries(row.id),
            icon: Receipt,
          },
          {
            label: 'Справки Плащания',
            onClick: () => handlePaymentInquiries(row.id),
            icon: CreditCard,
          },
        ];

        return (
          <div
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 justify-start"
          >
            <button
              onClick={() => handleWallet(row.id)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation flex-shrink-0"
              title="Портфейл"
            >
              <Wallet className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePrint(row.id)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation flex-shrink-0"
              title="Принтирай"
            >
              <Printer className="w-4 h-4" />
            </button>
            <DropdownMenu
              trigger={
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation flex-shrink-0"
                  title="Още опции"
                >
                  <MoreVertical className="w-4 h-4 flex-shrink-0" />
                </button>
              }
              items={dropdownItems}
              align="right"
            />
          </div>
        );
      },
    },
  ];

  const transformedData = {
    items: cashierRecords,
    meta: {
      pageCount: Math.ceil(cashierRecords.length / 10),
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Данни за такси и разходи</h4>
        <Badge variant="neutral" className="text-xs">
          {cashierRecords.length} апартамента
        </Badge>
      </div>

      <DataTable
        columns={columns}
        data={transformedData.items}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        page={page}
        pageCount={transformedData.meta.pageCount}
        sorting={sorting}
        onPageChange={setPage}
        onSortingChange={setSorting}
      />
    </div>
  );
}

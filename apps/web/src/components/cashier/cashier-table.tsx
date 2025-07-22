import { useState } from 'react';
import {
  ExpandableDataTable,
  ExpandableColumn,
  ExpandableRowData,
} from '@/components/ui/expandible-data-table';
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
import { useGetBuildingApartmentFeesQuery } from '@/redux/services/monthly-fee.service';

interface CashierTableProps {
  buildingId: string;
}

interface CashierRecord {
  id: string;
  apartment: string;
  floor: number;
  name: string;
  residentsCount: number;
  subscriptionNumber: string;
  new: number;
  old: number;
  total: number;
}

interface FeeDetails {
  id: string;
  name: string;
  amount: number;
  coefficient: number;
  description?: string;
  paymentBasis: string;
  applicationMode: string;
}



export function CashierTable({ buildingId }: CashierTableProps) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{
    field: keyof CashierRecord;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Fetch apartment fees for the building
  const {
    data: apartmentFeesData = [],
    isLoading,
    isFetching,
    error,
  } = useGetBuildingApartmentFeesQuery(buildingId);

  // Transform apartment fees data to cashier records
  const cashierRecords: ExpandableRowData<CashierRecord, FeeDetails>[] =
    apartmentFeesData.map((apartmentData: any) => {
      const { apartment, resident, fees, summary } = apartmentData;

      // Calculate payment amounts based on the description:
      // Ново = money expected to be paid for this month (current month's fees)
      // Старо = sum of unpaid money from previous months
      // Общо = total expected to be paid (Ново + Старо)
      const newAmount = summary.totalMonthlyAmount || 0; // Current month fees
      const oldAmount = (summary.totalOwed || 0) - newAmount; // Previous unpaid amounts
      const totalAmount = summary.totalOwed || 0; // Total amount owed

      const record: CashierRecord = {
        id: apartment.id,
        apartment: apartment.number,
        floor: apartment.floor,
        name: resident ? resident.name : 'Име Фамилия',
        residentsCount: apartment.residentsCount,
        subscriptionNumber: `12345678`, // Mock subscription number
        new: newAmount,
        old: Math.max(0, oldAmount), // Ensure it's not negative
        total: totalAmount,
      };

      const feeDetails: FeeDetails[] = fees.map((fee: any) => ({
        id: fee.id,
        name: fee.name,
        amount: fee.amount,
        coefficient: fee.coefficient,
        description: fee.description,
        paymentBasis: fee.paymentBasis,
        applicationMode: fee.applicationMode,
      }));

      return {
        id: apartment.id,
        data: record,
        children: feeDetails,
        isExpanded: false,
      };
    });

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
    const apartmentData = apartmentFeesData.find(
      (data: unknown) => (data as any)?.apartment?.id === recordId
    );
    const apartmentNumber = (apartmentData as any)?.apartment?.number || 'Unknown';

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

  const columns: ExpandableColumn<CashierRecord>[] = [
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

  const renderExpandedContent = (
    row: CashierRecord,
    children: FeeDetails[]
  ) => {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">
            Детайли за такси - Апартамент {row.apartment}
          </h4>
          <Badge variant="neutral" className="text-xs">
            {children.length} такса/такси
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">
                  Такса
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">
                  Основа
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">
                  Коефициент
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">
                  Сума
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">
                  Описание
                </th>
              </tr>
            </thead>
            <tbody>
              {children.map(fee => (
                <tr key={fee.id} className="border-b border-gray-100">
                  <td className="py-2 px-3 font-medium">{fee.name}</td>
                  <td className="py-2 px-3 text-gray-600">
                    <Badge variant="neutral" className="text-xs">
                      {fee.paymentBasis}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-gray-600">{fee.coefficient}</td>
                  <td className="py-2 px-3">
                    <span className="font-medium text-green-600">
                      {formatCurrency(fee.amount)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-600">
                    {fee.description || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {children.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Няма такси за този апартамент
          </div>
        )}
      </div>
    );
  };

  // Show error details if API call fails
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-red-500">Грешка при зареждане на данните</p>
          <p className="text-sm text-gray-500 mt-2">
            {JSON.stringify(error, null, 2)}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-gray-500">Зареждане на данни...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Данни за такси и разходи</h4>
        <Badge variant="neutral" className="text-xs">
          {cashierRecords.length} апартамента
        </Badge>
      </div>

      <ExpandableDataTable
        columns={columns}
        data={cashierRecords}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        page={page}
        pageCount={Math.ceil(cashierRecords.length / 10)}
        sorting={sorting}
        onPageChange={setPage}
        onSortingChange={setSorting}
        renderExpandedContent={renderExpandedContent}
      />
    </div>
  );
}

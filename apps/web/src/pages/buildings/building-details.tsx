import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import {
  Home,
  Users,
  Bell,
  Calendar,
  BarChart2,
  MessageSquare,
  Info,
  Pencil,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface Apartment {
  id: number;
  floor: number;
  name: string;
  residents: number;
  elevatorTax: number;
  cleaningTax: number;
  repairTax: number;
  maintenanceTax: number;
  generalExpenses: number;
  newTax: number;
  oldTax: number;
  total: number;
}

const mockBuildings = {
  1: {
    id: 1,
    name: 'Сграда А',
    address: 'ул. Първа 1',
    apartmentCount: 24,
    balance: 1500.5,
    debt: 300.0,
    description: 'Жилищна сграда с 24 апартамента',
  },
  2: {
    id: 2,
    name: 'Сграда Б',
    address: 'ул. Втора 2',
    apartmentCount: 16,
    balance: -500.25,
    debt: 1200.0,
    description: 'Жилищна сграда с 16 апартамента',
  },
  3: {
    id: 3,
    name: 'Сграда В',
    address: 'бул. Трети 3',
    apartmentCount: 32,
    balance: 2300.75,
    debt: 0.0,
    description: 'Жилищна сграда с 32 апартамента',
  },
};

const mockApartments: Apartment[] = [
  {
    id: 1,
    floor: 1,
    name: 'Иван Иванов',
    residents: 1,
    elevatorTax: 0.0,
    cleaningTax: 0.0,
    repairTax: 3.0,
    maintenanceTax: 3.0,
    generalExpenses: 3.0,
    newTax: 3.0,
    oldTax: 3.0,
    total: 6.0,
  },
  {
    id: 2,
    floor: 1,
    name: 'Петър Петров',
    residents: 2,
    elevatorTax: 0.0,
    cleaningTax: 0.0,
    repairTax: 3.0,
    maintenanceTax: 3.0,
    generalExpenses: 3.0,
    newTax: 3.0,
    oldTax: 3.0,
    total: 6.0,
  },
];

export function BuildingDetailsPage() {
  const { id } = useParams();
  const buildingId = id ? parseInt(id) : null;
  const building = buildingId
    ? mockBuildings[buildingId as keyof typeof mockBuildings]
    : null;

  if (!building) {
    return <div>Building not found</div>;
  }

  const stats = {
    balance: `${building.balance.toFixed(2)} лв.`,
    balanceChange:
      building.balance > 0
        ? '+23.00лв спрямо с предходния месец'
        : '-23.00лв спрямо с предходния месец',
    obligations: `${building.debt.toFixed(2)} лв.`,
    obligationsChange: '+230.00лв спрямо с предходния месец',
    apartments: building.apartmentCount.toString(),
    apartmentsWithDebt: '3 апартамента със задължения',
    debts: '9',
    debtsDetails: 'задължения от 3 апартамента',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Breadcrumbs
              segments={[
                { label: 'Сгради', href: '/buildings' },
                { label: building.name },
              ]}
            />
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">{building.description}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Редактирай
        </Button>
      </div>

      <div className="flex border-b">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-red-500 border-b-2 border-red-500 rounded-none"
        >
          <Home className="h-4 w-4" />
          Апартаменти
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <Users className="h-4 w-4" />
          Каса
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <BarChart2 className="h-4 w-4" />
          Касиер
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <Bell className="h-4 w-4" />
          Нередности
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <Users className="h-4 w-4" />
          Потребители
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <MessageSquare className="h-4 w-4" />
          Съобщения
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-500"
        >
          <Calendar className="h-4 w-4" />
          Календар
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Баланс</h3>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart2 className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.balance}</p>
          <p className="text-sm text-gray-500">{stats.balanceChange}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Задължения</h3>
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
              <Bell className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-red-500 mt-2">
            {stats.obligations}
          </p>
          <p className="text-sm text-gray-500">{stats.obligationsChange}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Апартаменти</h3>
            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Home className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.apartments}</p>
          <p className="text-sm text-red-500">{stats.apartmentsWithDebt}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Нередности</h3>
            <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
              <Bell className="h-4 w-4 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.debts}</p>
          <p className="text-sm text-gray-500">{stats.debtsDetails}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Апартаменти</h2>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Домова Книга
            </Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600">
              Добави Апартамент
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                <th className="p-4 font-medium">Апартамент</th>
                <th className="p-4 font-medium">Етаж</th>
                <th className="p-4 font-medium">Име</th>
                <th className="p-4 font-medium">Брой Живущи</th>
                <th className="p-4 font-medium">Такса Асансьор</th>
                <th className="p-4 font-medium">Ток Асансьор</th>
                <th className="p-4 font-medium">Ток Стълбище</th>
                <th className="p-4 font-medium">Почистване</th>
                <th className="p-4 font-medium">УЕС</th>
                <th className="p-4 font-medium">Ново?!</th>
                <th className="p-4 font-medium">Старо?!</th>
                <th className="p-4 font-medium">Общо</th>
                <th className="p-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {mockApartments.map(apartment => (
                <tr key={apartment.id} className="border-b">
                  <td className="p-4">
                    <Link
                      to={`/apartments/${apartment.id}`}
                      className="text-red-500 hover:underline"
                    >
                      {apartment.id}
                    </Link>
                  </td>
                  <td className="p-4">{apartment.floor}</td>
                  <td className="p-4">{apartment.name}</td>
                  <td className="p-4">{apartment.residents}</td>
                  <td className="p-4">{apartment.elevatorTax} лв.</td>
                  <td className="p-4">{apartment.cleaningTax} лв.</td>
                  <td className="p-4">{apartment.repairTax} лв.</td>
                  <td className="p-4">{apartment.maintenanceTax} лв.</td>
                  <td className="p-4">{apartment.generalExpenses} лв.</td>
                  <td className="p-4">{apartment.newTax} лв.</td>
                  <td className="p-4">{apartment.oldTax} лв.</td>
                  <td className="p-4 font-medium text-red-500">
                    {apartment.total} лв.
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      •••
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

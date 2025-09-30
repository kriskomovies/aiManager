import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Building, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { PartnerDetails } from './types';

interface OverviewTabProps {
  partner: PartnerDetails;
}

export function OverviewTab({ partner }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Контактна информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Основен имейл</p>
              <p className="text-sm text-gray-600">{partner.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Телефон</p>
              <p className="text-sm text-gray-600">{partner.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Адрес</p>
              <p className="text-sm text-gray-600">
                {partner.address}
                <br />
                {partner.postalCode} {partner.city}, {partner.country}
              </p>
            </div>
          </div>
          {partner.contactPersonName && (
            <div className="pt-3 border-t">
              <p className="text-sm font-medium mb-2">Контактно лице</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {partner.contactPersonName}
                </p>
                {partner.contactPersonEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-600">
                      {partner.contactPersonEmail}
                    </p>
                  </div>
                )}
                {partner.contactPersonPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-600">
                      {partner.contactPersonPhone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            Бизнес информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">ДДС номер</p>
            <p className="text-sm text-gray-600">{partner.taxNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Регистрационен номер</p>
            <p className="text-sm text-gray-600">
              {partner.registrationNumber}
            </p>
          </div>
          {partner.creditLimit && (
            <div>
              <p className="text-sm font-medium">Кредитен лимит</p>
              <p className="text-sm text-gray-600">
                {partner.creditLimit.toLocaleString()} лв.
              </p>
            </div>
          )}
          {partner.paymentTerms && (
            <div>
              <p className="text-sm font-medium">Условия за плащане</p>
              <p className="text-sm text-gray-600">
                {partner.paymentTerms} дни
              </p>
            </div>
          )}
          {partner.contractStartDate && partner.contractEndDate && (
            <div className="pt-3 border-t">
              <p className="text-sm font-medium mb-2">Договор</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  От:{' '}
                  {new Date(partner.contractStartDate).toLocaleDateString(
                    'bg-BG'
                  )}
                </p>
                <p className="text-xs text-gray-600">
                  До:{' '}
                  {new Date(partner.contractEndDate).toLocaleDateString(
                    'bg-BG'
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services and Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Услуги и достъп
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Предоставяни услуги</p>
            <div className="flex flex-wrap gap-2">
              {partner.servicesProvided.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
          {partner.buildingsAccess.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Достъп до сгради</p>
              <div className="space-y-1">
                {partner.buildingsAccess.map((building, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    • {building}
                  </p>
                ))}
              </div>
            </div>
          )}
          {partner.description && (
            <div className="pt-3 border-t">
              <p className="text-sm font-medium mb-2">Описание</p>
              <p className="text-sm text-gray-600">{partner.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

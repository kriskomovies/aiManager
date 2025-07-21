import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectModalData } from '@/redux/slices/modal-slice';

interface MessageDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  deliveryMethod: 'SMS' | 'EMAIL' | 'PUSH' | 'IN_APP';
  recipients: string[];
  recipientDisplay: string;
  hasAttachedFile: boolean;
  attachedFileName?: string;
}

interface ViewMessageModalProps {
  onClose: () => void;
}

export function ViewMessageModal({ onClose }: ViewMessageModalProps) {
  const modalData = useAppSelector(selectModalData);
  const messageId = modalData?.messageId;
  const buildingId = modalData?.buildingId;

  // Mock message data - TODO: Load real data based on messageId
  const [messageDetails, setMessageDetails] = useState<MessageDetails | null>(null);

  useEffect(() => {
    // TODO: Load real message data based on messageId
    console.log('Loading message:', messageId, 'for building:', buildingId);
    
    // Mock data that matches the design
    const mockMessage: MessageDetails = {
      id: String(messageId || '1'),
      title: 'Счупена Панта',
      description: 'Описание на Нередност ала бала. Описание на Нередност ала бала. Описание на Нередност ала бала. Описание на Нередност ала бала. Описание на Нередност ала бала. Описание на Нередност ала бала.',
      date: '10.12.2024',
      deliveryMethod: 'SMS',
      recipients: ['apartment_1', 'apartment_2', 'apartment_3', 'apartment_7'],
      recipientDisplay: 'Ап 1, Ап 2, Ап 3, Ап7',
      hasAttachedFile: true,
      attachedFileName: 'document.pdf'
    };
    
    setMessageDetails(mockMessage);
  }, [messageId, buildingId]);

  const handleClose = () => {
    onClose();
  };

  const handleViewFile = () => {
    if (messageDetails?.hasAttachedFile) {
      // TODO: Open attached file
      console.log('View attached file:', messageDetails.attachedFileName);
    }
  };

  const getDeliveryMethodLabel = (method: MessageDetails['deliveryMethod']) => {
    const methodMap = {
      'SMS': 'SMS',
      'EMAIL': 'Email',
      'PUSH': 'Push нотификация',
      'IN_APP': 'В приложението',
    };
    return methodMap[method] || method;
  };

  if (!messageDetails) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Зареждане...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-left mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Съобщение
        </h3>
        <div className="text-right text-sm text-gray-500">
          {messageDetails.date}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-2">
            {messageDetails.title}
          </h4>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {messageDetails.description}
          </p>
        </div>

        {/* Delivery Method and Recipients */}
        <div className="space-y-4 text-sm">
          <div>
            <span className="text-gray-500 block mb-1">Метод на Доставка</span>
            <div className="font-medium text-gray-900">
              {getDeliveryMethodLabel(messageDetails.deliveryMethod)}
            </div>
          </div>
          
          <div>
            <span className="text-gray-500 block mb-1">Получатели</span>
            <div className="font-medium text-gray-900">
              {messageDetails.recipientDisplay}
            </div>
          </div>
        </div>

        {/* Attached File */}
        {messageDetails.hasAttachedFile && (
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-sm"
              onClick={handleViewFile}
            >
              <Eye className="h-4 w-4" />
              Прикачен Файл
            </Button>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="px-6"
          >
            Затвори
          </Button>
        </div>
      </div>
    </div>
  );
}

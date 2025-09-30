import { IrregularityStatus, IrregularityPriority } from './irregularity.enums';

export interface IIrregularityResponse {
  id: string;
  title: string;
  description?: string;
  buildingId: string;
  apartmentId?: string;
  status: IrregularityStatus;
  priority: IrregularityPriority;
  location?: string;
  estimatedCost?: number;
  actualCost?: number;
  expectedCompletionDate?: string;
  completedAt?: string;
  resolutionNotes?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relationships
  building: {
    id: string;
    name: string;
  };
  apartment?: {
    id: string;
    number: string;
    floor: number;
  };
  reportedBy: {
    id: string;
    name: string;
    surname: string;
    fullName: string;
  };
  assignedUser?: {
    id: string;
    name: string;
    surname: string;
    fullName: string;
  };
  attachments: IIrregularityAttachment[];
  
  // Computed fields
  isOverdue: boolean;
  daysOverdue: number;
}

export interface IIrregularityListItem {
  id: string;
  title: string;
  buildingName: string;
  apartmentNumber?: string;
  status: IrregularityStatus;
  priority: IrregularityPriority;
  reportedBy: string;
  assignedUser?: string;
  createdAt: string;
  expectedCompletionDate?: string;
  isOverdue: boolean;
  attachmentCount: number;
}

export interface ICreateIrregularityRequest {
  title: string;
  description?: string;
  buildingId: string;
  apartmentId?: string; // If specific to apartment
  priority: IrregularityPriority;
  location?: string;
  expectedCompletionDate?: string;
}

export interface IUpdateIrregularityRequest {
  title?: string;
  description?: string;
  status?: IrregularityStatus;
  priority?: IrregularityPriority;
  location?: string;
  assignedUserId?: string;
  estimatedCost?: number;
  actualCost?: number;
  expectedCompletionDate?: string;
  resolutionNotes?: string;
}

export interface IIrregularityQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  buildingId?: string;
  apartmentId?: string;
  status?: IrregularityStatus;
  priority?: IrregularityPriority;
  reportedById?: string;
  assignedUserId?: string;
  isArchived?: boolean;
  isOverdue?: boolean;
}

export interface IIrregularityAttachment {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
    surname: string;
  };
}

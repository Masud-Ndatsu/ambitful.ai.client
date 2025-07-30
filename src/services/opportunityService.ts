import { apiService } from './api';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  category: string;
  tags: string[];
  requirements: string[];
  benefits: string[];
  remote: boolean;
  featured: boolean;
  status: 'active' | 'inactive' | 'closed';
  createdAt: string;
  updatedAt: string;
  applicationDeadline?: string;
  contactEmail?: string;
  applicationUrl?: string;
  views: number;
  applications: number;
}

export interface OpportunityFilters {
  search?: string;
  category?: string;
  location?: string;
  type?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'salary-high' | 'salary-low' | 'views' | 'applications';
  page?: number;
  limit?: number;
}

export interface OpportunityListResponse {
  opportunities: Opportunity[];
  total: number;
  page: number;
  totalPages: number;
  filters: {
    categories: string[];
    locations: string[];
    types: string[];
    tags: string[];
  };
}

export interface CreateOpportunityData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: Opportunity['type'];
  category: string;
  tags: string[];
  requirements: string[];
  benefits: string[];
  remote: boolean;
  applicationDeadline?: string;
  contactEmail?: string;
  applicationUrl?: string;
}

export class OpportunityService {
  async getOpportunities(filters: OpportunityFilters = {}): Promise<OpportunityListResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await apiService.get<OpportunityListResponse>(
      `/opportunities?${queryParams.toString()}`
    );
    return response.data;
  }

  async getOpportunityById(id: string): Promise<Opportunity> {
    const response = await apiService.get<Opportunity>(`/opportunities/${id}`);
    return response.data;
  }

  async getFeaturedOpportunities(limit: number = 6): Promise<Opportunity[]> {
    const response = await apiService.get<Opportunity[]>(`/opportunities/featured?limit=${limit}`);
    return response.data;
  }

  async createOpportunity(data: CreateOpportunityData): Promise<Opportunity> {
    const response = await apiService.post<Opportunity>('/opportunities', data);
    return response.data;
  }

  async updateOpportunity(id: string, data: Partial<CreateOpportunityData>): Promise<Opportunity> {
    const response = await apiService.put<Opportunity>(`/opportunities/${id}`, data);
    return response.data;
  }

  async deleteOpportunity(id: string): Promise<void> {
    await apiService.delete(`/opportunities/${id}`);
  }

  async applyToOpportunity(
    opportunityId: string, 
    applicationData: {
      coverLetter?: string;
      resume?: File;
      additionalInfo?: string;
    }
  ): Promise<{ message: string; applicationId: string }> {
    const formData = new FormData();
    formData.append('opportunityId', opportunityId);
    
    if (applicationData.coverLetter) {
      formData.append('coverLetter', applicationData.coverLetter);
    }
    if (applicationData.resume) {
      formData.append('resume', applicationData.resume);
    }
    if (applicationData.additionalInfo) {
      formData.append('additionalInfo', applicationData.additionalInfo);
    }

    const response = await fetch('/api/opportunities/apply', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiService.getAuthToken()}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Application failed');
    }

    return data;
  }

  async getMyApplications(): Promise<{
    opportunityId: string;
    opportunity: Opportunity;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    appliedAt: string;
    coverLetter?: string;
    additionalInfo?: string;
  }[]> {
    const response = await apiService.get<{
      opportunityId: string;
      opportunity: Opportunity;
      status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
      appliedAt: string;
      coverLetter?: string;
      additionalInfo?: string;
    }[]>('/user/applications');
    return response.data;
  }

  async saveOpportunity(opportunityId: string): Promise<void> {
    await apiService.post(`/opportunities/${opportunityId}/save`);
  }

  async unsaveOpportunity(opportunityId: string): Promise<void> {
    await apiService.delete(`/opportunities/${opportunityId}/save`);
  }

  async getSavedOpportunities(): Promise<Opportunity[]> {
    const response = await apiService.get<Opportunity[]>('/user/saved-opportunities');
    return response.data;
  }
}

export const opportunityService = new OpportunityService();
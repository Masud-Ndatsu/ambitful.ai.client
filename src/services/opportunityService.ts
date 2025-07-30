import { apiService } from "./api";
import {
  Opportunity,
  OpportunityFilters,
  OpportunityListResponse,
  CreateOpportunityData,
  ApplicationData,
  ApplicationResponse,
  UserApplication
} from "../types/opportunity";

export class OpportunityService {
  async getOpportunities(
    filters: OpportunityFilters = {}
  ): Promise<OpportunityListResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v.toString()));
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
    const response = await apiService.get<Opportunity[]>(
      `/opportunities/featured?limit=${limit}`
    );
    return response.data;
  }

  async createOpportunity(data: CreateOpportunityData): Promise<Opportunity> {
    const response = await apiService.post<Opportunity>("/opportunities", data);
    return response.data;
  }

  async updateOpportunity(
    id: string,
    data: Partial<CreateOpportunityData>
  ): Promise<Opportunity> {
    const response = await apiService.put<Opportunity>(
      `/opportunities/${id}`,
      data
    );
    return response.data;
  }

  async deleteOpportunity(id: string): Promise<void> {
    await apiService.delete(`/opportunities/${id}`);
  }

  async applyToOpportunity(
    opportunityId: string,
    applicationData: ApplicationData
  ): Promise<ApplicationResponse> {
    const formData = new FormData();
    formData.append("opportunityId", opportunityId);

    if (applicationData.coverLetter) {
      formData.append("coverLetter", applicationData.coverLetter);
    }
    if (applicationData.resume) {
      formData.append("resume", applicationData.resume);
    }
    if (applicationData.additionalInfo) {
      formData.append("additionalInfo", applicationData.additionalInfo);
    }

    const response = await fetch("/api/opportunities/apply", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiService.getAuthToken()}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Application failed");
    }

    return data;
  }

  async getMyApplications(): Promise<UserApplication[]> {
    const response = await apiService.get<UserApplication[]>("/user/applications");
    return response.data;
  }

  async saveOpportunity(opportunityId: string): Promise<void> {
    await apiService.post(`/opportunities/${opportunityId}/save`);
  }

  async unsaveOpportunity(opportunityId: string): Promise<void> {
    await apiService.delete(`/opportunities/${opportunityId}/save`);
  }

  async getSavedOpportunities(): Promise<Opportunity[]> {
    const response = await apiService.get<Opportunity[]>(
      "/user/saved-opportunities"
    );
    return response.data;
  }
}

export const opportunityService = new OpportunityService();

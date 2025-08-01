import { apiService } from "./api";
import {
  Opportunity,
  OpportunityFilters,
  OpportunityListResponse,
  CreateOpportunityData,
  ApplicationData,
  ApplicationResponse,
  UserApplication,
  ShareOpportunityData,
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
    return response;
  }

  async getOpportunityById(id: string): Promise<Opportunity> {
    const response = await apiService.get<Opportunity>(`/opportunities/${id}`);
    return response;
  }

  async getFeaturedOpportunities(limit: number = 6): Promise<Opportunity[]> {
    const response = await apiService.get<Opportunity[]>(
      `/opportunities/featured?limit=${limit}`
    );
    return response;
  }

  async getTrendingOpportunities(limit: number = 6): Promise<Opportunity[]> {
    const response = await apiService.get<Opportunity[]>(
      `/opportunities/trending?limit=${limit}`
    );
    return response;
  }

  async getSimilarOpportunities(
    id: string,
    limit: number = 5
  ): Promise<Opportunity[]> {
    const response = await apiService.get<Opportunity[]>(
      `/opportunities/similar/${id}?limit=${limit}`
    );
    return response;
  }

  async createOpportunity(data: CreateOpportunityData): Promise<Opportunity> {
    const response = await apiService.post<Opportunity>("/opportunities", data);
    return response;
  }

  async updateOpportunity(
    id: string,
    data: Partial<CreateOpportunityData>
  ): Promise<Opportunity> {
    const response = await apiService.put<Opportunity>(
      `/opportunities/${id}`,
      data
    );
    return response;
  }

  async deleteOpportunity(id: string): Promise<void> {
    await apiService.delete(`/opportunities/${id}`);
  }

  async applyToOpportunity(
    opportunityId: string,
    applicationData: ApplicationData
  ): Promise<ApplicationResponse> {
    // If there's a file, use FormData
    if (applicationData.resume) {
      const formData = new FormData();

      if (applicationData.coverLetter) {
        formData.append("coverLetter", applicationData.coverLetter);
      }
      if (applicationData.resume) {
        formData.append("resume", applicationData.resume);
      }
      if (applicationData.additionalInfo) {
        formData.append("additionalInfo", applicationData.additionalInfo);
      }

      const response = await fetch(
        `${apiService.getBaseURL()}/opportunities/${opportunityId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiService.getAuthToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          message: errorData.error || "Application failed",
          status: response.status,
        };
      }

      return await response.json();
    } else {
      // No file, use regular JSON
      const response = await apiService.post<ApplicationResponse>(
        `/opportunities/${opportunityId}/apply`,
        applicationData
      );
      return response;
    }
  }

  async getUserApplications(): Promise<UserApplication[]> {
    const response = await apiService.get<UserApplication[]>(
      "/opportunities/applied"
    );
    return response;
  }

  async saveOpportunity(opportunityId: string): Promise<void> {
    await apiService.post(`/opportunities/${opportunityId}/save`);
  }

  async unsaveOpportunity(opportunityId: string): Promise<void> {
    await apiService.delete(`/opportunities/${opportunityId}/save`);
  }

  async getSavedOpportunities(
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
      `/opportunities/saved?${queryParams.toString()}`
    );
    return response;
  }

  async shareOpportunity(
    opportunityId: string,
    shareData: ShareOpportunityData
  ): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(
      `/opportunities/${opportunityId}/share`,
      shareData
    );
    return response;
  }

  async recordOpportunityView(opportunityId: string): Promise<void> {
    await apiService.post(`/opportunities/${opportunityId}/view`);
  }
}

export const opportunityService = new OpportunityService();

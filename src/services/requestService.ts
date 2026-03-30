import { supabase } from '../lib/supabase';
import { LaptopRequest } from '../types';

// Convert from DB to App types
const mapRequestFromDB = (dbRequest: any): LaptopRequest => ({
  id: dbRequest.id,
  applicantName: dbRequest.applicant_name,
  lawyerName: dbRequest.lawyer_name,
  reason: dbRequest.reason,
  requestedLaptopId: dbRequest.requested_laptop_id,
  status: dbRequest.status,
  createdAt: dbRequest.created_at,
  updatedAt: dbRequest.updated_at
});

export const requestService = {
  // Get all pending requests
  async getPendingRequests(): Promise<LaptopRequest[]> {
    const { data, error } = await supabase
      .from('laptop_requests')
      .select('*')
      .eq('status', 'pendiente')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending requests:', error);
      throw error;
    }

    return data.map(mapRequestFromDB);
  },

  // Create a new request
  async createRequest(requestData: Omit<LaptopRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<LaptopRequest> {
    const { data, error } = await supabase
      .from('laptop_requests')
      .insert({
        applicant_name: requestData.applicantName,
        lawyer_name: requestData.lawyerName,
        reason: requestData.reason,
        requested_laptop_id: requestData.requestedLaptopId,
        status: 'pendiente'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      throw error;
    }

    return mapRequestFromDB(data);
  },

  // Update request status
  async updateRequestStatus(id: string, status: 'aprobada' | 'rechazada'): Promise<LaptopRequest> {
    const { data, error } = await supabase
      .from('laptop_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating request status to ${status}:`, error);
      throw error;
    }

    return mapRequestFromDB(data);
  }
};

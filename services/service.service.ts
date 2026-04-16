import { Service, IService } from '@/models/Service';

export class ServiceService {
  async getAllServices(filters?: {
    status?: boolean;
    category?: string;
    sub_category?: string;
    bestTreatment?: boolean;
    popularProduct?: boolean;
  }): Promise<IService[]> {
    const query: any = {};
    if (filters?.status !== undefined) query.status = filters.status;
    if (filters?.category) query.category = filters.category;
    if (filters?.sub_category) query.sub_category = filters.sub_category;
    if (filters?.bestTreatment !== undefined) query.bestTreatment = filters.bestTreatment;
    if (filters?.popularProduct !== undefined) query.popularProduct = filters.popularProduct;

    return Service.find(query)
      .populate('category')
      .populate('sub_category')
      .populate('tags')
      .sort({ created_at: -1 });
  }

  async getServiceById(id: string): Promise<IService | null> {
    return Service.findById(id)
      .populate('category')
      .populate('sub_category')
      .populate('tags');
  }

  async getServiceBySlug(slug: string): Promise<IService | null> {
    return Service.findOne({ slug })
      .populate('category')
      .populate('sub_category')
      .populate('tags');
  }

  async createService(data: Partial<IService>): Promise<IService> {
    const service = new Service(data);
    return service.save();
  }

  async updateService(id: string, data: Partial<IService>): Promise<IService | null> {
    return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await Service.findByIdAndDelete(id);
    return !!result;
  }
}


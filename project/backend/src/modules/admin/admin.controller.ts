import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { sendSuccess } from '../../utils/response.utils';
import { AppError } from '../../utils/AppError';

const adminService = new AdminService();

// --- 1. INJECT RESOURCE CONTROLLER ---
export const addResourceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, url, difficulty, platform, type, tagId } = req.body;

    if (!title || !url || !type) {
      return next(new AppError('Title, URL, and Resource Type are required', 400));
    }

    const newResource = await adminService.addResource({
      title,
      url,
      difficulty: difficulty || 0,
      platform: platform || 'System',
      type,   
      tagId   
    });

    sendSuccess(res, 201, newResource, 'Resource successfully injected into the matrix.');
  } catch (error) {
    next(error);
  }
};

// --- 2. INITIALIZE TOPIC CONTROLLER (UPDATED FOR CATEGORY) ---
export const addTopicController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract both name and the new manual category from the frontend
    const { name, category } = req.body;
    
    if (!name) {
      return next(new AppError('Module / Topic name is required', 400));
    }
    
    // Clean up the category (remove accidental spaces), or default to 'algorithm' if left blank
    const finalCategory = category && category.trim() !== '' ? category.trim() : 'algorithm';
    
    // Pass BOTH variables to the service
    const newTopic = await adminService.addTopic(name, finalCategory);
    
    sendSuccess(res, 201, newTopic, 'New topic initialized in the matrix.');
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new AppError('This topic already exists in the system database.', 400));
    }
    next(error);
  }
};

// --- 3. GET ALL RESOURCES (READ) ---
export const getResourcesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await adminService.getAllResources();
    sendSuccess(res, 200, resources);
  } catch (error) {
    next(error);
  }
};

// --- 4. UPDATE RESOURCE (UPDATE) ---
export const updateResourceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resourceId = parseInt(id as string);
    
    if (isNaN(resourceId)) {
      return next(new AppError('Invalid resource ID provided in the URL', 400));
    }

    await adminService.updateResource(resourceId, req.body);
    sendSuccess(res, 200, null, 'Resource updated successfully');
  } catch (error) {
    next(error);
  }
};

// --- 5. DELETE RESOURCE (DELETE) ---
export const deleteResourceController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resourceId = parseInt(id as string);
    
    if (isNaN(resourceId)) {
      return next(new AppError('Invalid resource ID provided in the URL', 400));
    }

    await adminService.deleteResource(resourceId);
    sendSuccess(res, 200, null, 'Resource purged from the system');
  } catch (error) {
    next(error);
  }
};
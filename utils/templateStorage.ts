
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageTemplate } from '@/types/template';

const STORAGE_KEY = '@message_templates';

export const saveTemplates = async (templates: MessageTemplate[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(templates);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('Templates saved successfully');
  } catch (error) {
    console.error('Error saving templates:', error);
    throw error;
  }
};

export const loadTemplates = async (): Promise<MessageTemplate[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      console.log('Templates loaded successfully');
      return JSON.parse(jsonValue);
    }
    console.log('No templates found, returning empty array');
    return [];
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
  try {
    const templates = await loadTemplates();
    const filteredTemplates = templates.filter(t => t.id !== templateId);
    await saveTemplates(filteredTemplates);
    console.log('Template deleted successfully');
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};

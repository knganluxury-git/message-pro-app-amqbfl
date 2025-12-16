
import { TemplateField } from '@/types/template';

export const parseTemplateFields = (content: string): TemplateField[] => {
  const fieldRegex = /\{([^}]+)\}/g;
  const fields: TemplateField[] = [];
  const seenFields = new Set<string>();
  
  let match;
  while ((match = fieldRegex.exec(content)) !== null) {
    const fieldName = match[1].trim();
    if (!seenFields.has(fieldName)) {
      seenFields.add(fieldName);
      fields.push({
        id: `field_${Date.now()}_${Math.random()}`,
        name: fieldName,
        placeholder: `Nhập ${fieldName}`,
        value: '',
      });
    }
  }
  
  console.log('Parsed fields:', fields);
  return fields;
};

export const generateMessage = (content: string, fields: TemplateField[]): string => {
  let result = content;
  
  fields.forEach(field => {
    const regex = new RegExp(`\\{${field.name}\\}`, 'g');
    result = result.replace(regex, field.value || `{${field.name}}`);
  });
  
  console.log('Generated message:', result);
  return result;
};

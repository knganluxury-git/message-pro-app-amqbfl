
export interface TemplateField {
  id: string;
  name: string;
  placeholder: string;
  value?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  fields: TemplateField[];
  createdAt: number;
  updatedAt: number;
}

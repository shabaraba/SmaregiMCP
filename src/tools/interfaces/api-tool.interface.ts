export interface ApiToolParameter {
  name: string;
  description: string;
  required: boolean;
  type: string;
  schema?: any; // zod schema
}

export interface ApiTool {
  name: string;
  description: string;
  parameters: ApiToolParameter[];
  path: string;
  method: string;
  operationId?: string;
}

export interface ColorSystem {
  palette: string[];
  dominant: string;
  mood: string;
}

export interface LayoutDNA {
  grid: string;
  hierarchy: string;
  structure: string;
  spacing: string;
}

export interface ComponentDNA {
  shapes: string;
  interactivity: string;
  description: string;
}

export interface TypographyDNA {
  style: string;
  weight: string;
  description: string;
}

export interface DesignDNA {
  id: string;
  timestamp: number;
  imageUrl?: string; // Base64 preview
  styleTags: string[];
  colors: ColorSystem;
  layout: LayoutDNA;
  components: ComponentDNA;
  typography: TypographyDNA;
  basePrompt: string;
}

export interface ImageUpload {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export interface DraftComponent {
  type: 'container' | 'text' | 'header' | 'button' | 'image' | 'input' | 'card';
  content?: string;
  styles: string; // Tailwind class string
  children?: DraftComponent[];
}

export interface DraftResponse {
  draft: DraftComponent;
  finalPrompt: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  ai_summary?: string | null;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

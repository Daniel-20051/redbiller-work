// Utility functions for handling draft storage in local storage

export interface DraftData {
  actionItems: string;
  ongoingItems: string;
  completedItems: string;
  timestamp: number;
}

const DRAFT_KEY = 'weekly_report_draft';

export const saveDraftToStorage = (draftData: Partial<DraftData>): void => {
  try {
    const existingDraft = loadDraftFromStorage();
    const updatedDraft = {
      ...existingDraft,
      ...draftData,
      timestamp: Date.now()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDraft));
  } catch (error) {
    console.error('Error saving draft to localStorage:', error);
  }
};

export const loadDraftFromStorage = (): DraftData => {
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      return JSON.parse(draft);
    }
  } catch (error) {
    console.error('Error loading draft from localStorage:', error);
  }
  
  return {
    actionItems: '',
    ongoingItems: '',
    completedItems: '',
    timestamp: 0
  };
};

export const clearDraftFromStorage = (): void => {
  try {
    console.log('Clearing draft from localStorage with key:', DRAFT_KEY);
    console.log('Before clearing:', localStorage.getItem(DRAFT_KEY));
    localStorage.removeItem(DRAFT_KEY);
    console.log('After clearing:', localStorage.getItem(DRAFT_KEY));
  } catch (error) {
    console.error('Error clearing draft from localStorage:', error);
  }
};

export const parseItemsFromStorage = (items: string): string[] => {
  if (!items || items.trim() === '') {
    return [];
  }
  return items.split('\n').filter(item => item.trim() !== '');
};

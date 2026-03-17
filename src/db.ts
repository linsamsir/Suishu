import Dexie, { type Table } from 'dexie';

export interface DiaryEntry {
  id?: number;
  date: Date;
  lunarDate: string;
  shichen: string;
  mood: string;
  title?: string;
  content: string;
  photo?: Blob;
  createdAt: number;
}

export interface AppSettings {
  id?: number;
  pin?: string;
  isLocked: boolean;
  language?: 'zh' | 'en' | 'ja';
  itemsPerPage?: number;
}

export class SuishuDatabase extends Dexie {
  entries!: Table<DiaryEntry>;
  settings!: Table<AppSettings>;

  constructor() {
    super('SuishuDB');
    this.version(1).stores({
      entries: '++id, date, mood, createdAt',
      settings: '++id'
    });
  }
}

export const db = new SuishuDatabase();

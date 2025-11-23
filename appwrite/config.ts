import { Client, Account, Databases, Storage } from 'appwrite';

// Appwrite конфигурация
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '692232df000ec6518cd8';

// Имена коллекций и bucket
export const DATABASE_ID = 'main';
export const USERS_COLLECTION_ID = 'users';
export const VIDEOS_COLLECTION_ID = 'videos';
export const COMMENTS_COLLECTION_ID = 'comments';
export const STORAGE_BUCKET_ID = 'videos';

// Инициализация Appwrite клиента
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Экспорт сервисов
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { client };


import AsyncStorage from '@react-native-async-storage/async-storage';
import { GROUP_COLLECTION } from '../storageConfig';
import { groupsGetAll } from './groupsGetAll';
import { AppError } from '../../utils/appError';

export async function groupCreate(newGroup: string) {
  try {
    const groups = await groupsGetAll();
    const groupAlreadyExists = groups.includes(newGroup);

    if (groupAlreadyExists) throw new AppError('Grupo já existe');
    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify([...groups, newGroup]));
  } catch (error) {
    throw error;
  }
}

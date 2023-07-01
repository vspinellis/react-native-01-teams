import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerStorageDTO } from './PlayerStorageDTO';
import { PLAYER_COLLECTION } from '../storageConfig';
import { playersGetByGroup } from './playersGetByGroup';
import { AppError } from '../../utils/appError';

export async function PlayerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storedPlayers = await playersGetByGroup(group);

    const playerAlreadyExists = storedPlayers.filter(
      (player) => player.name === newPlayer.name
    );

    if (playerAlreadyExists.length > 0) {
      throw new AppError('Essa pessoa já está adicionada em um time aqui');
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer]);
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
  } catch (error) {
    throw error;
  }
}

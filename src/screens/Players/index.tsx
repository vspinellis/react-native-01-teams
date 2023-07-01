import { Alert, FlatList, TextInput } from 'react-native';
import ButtonIcon from '../../components/ButtonIcon';
import Filter from '../../components/Filter';
import Header from '../../components/Header';
import HighLight from '../../components/HighLight';
import Input from '../../components/Input';
import { Container, Form, HeaderList, NumberOfPlayer } from './styles';
import { useEffect, useRef, useState } from 'react';
import PlayerCard from '../../components/PlayerCard';
import ListEmpty from '../../components/ListEmpty';
import Button from '../../components/Button';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { AppError } from '../../utils/appError';
import { PlayerAddByGroup } from '../../storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '../../storage/player/playerGetByGroupAndTeam';
import { PlayerStorageDTO } from '../../storage/player/PlayerStorageDTO';
import { playerRemoveByGroup } from '../../storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '../../storage/group/groupRemoveByName';
import { Loading } from '../../components/Loading';

type RouteParams = {
  group: string;
};

export default function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [team, setTeam] = useState('Time A');
  const newPlayerNameInputRef = useRef<TextInput>(null);
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const { params } = useRoute<RouteProp<ParamListBase> & { params: RouteParams }>();

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar');
    }

    const newPlayer = {
      name: newPlayerName,
      team
    };

    try {
      await PlayerAddByGroup(newPlayer, params.group);
      setNewPlayerName('');
      fetchPlayersByTeam();
      // newPlayerNameInputRef.current?.blur();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova Pessoa', error.message);
      } else {
        console.log(error);
        Alert.alert('Nova Pessoa', 'Não foi possível adicionar');
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);

      const playersByTeam = await playersGetByGroupAndTeam(params.group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      Alert.alert('Pessoa', 'Erro ao buscar os dados!');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, params.group);
      fetchPlayersByTeam();
    } catch (error) {
      Alert.alert('Remover pessoa', 'Erro ao remover a pessoa!');
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(params.group);
      navigation.navigate('groups');
    } catch (error) {
      Alert.alert('Remover Grupo', 'Erro ao remover o grupo');
    }
  }

  async function handleGroupRemove() {
    Alert.alert('Remover', 'Deseja remover a turma?', [
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: () => groupRemove()
      }
    ]);
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />
      <HighLight title={params.group} subtitle='Adicione a galera e separe os times' />
      <Form>
        <Input
          placeholder='Nome da pessoa'
          autoCorrect={false}
          inputRef={newPlayerNameInputRef}
          value={newPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType='done'
          onChangeText={setNewPlayerName}
        />
        <ButtonIcon icon='add' onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'time B']}
          keyExtractor={(item) => item}
          horizontal
          renderItem={({ item }) => (
            <Filter onPress={() => setTeam(item)} isActive={team === item} title={item} />
          )}
        />
        <NumberOfPlayer>{players.length}</NumberOfPlayer>
      </HeaderList>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PlayerCard onRemove={() => handlePlayerRemove(item.name)} name={item.name} />
          )}
          ListEmptyComponent={() => <ListEmpty message='Não há pessoas nesse time' />}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 }
          ]}
        />
      )}
      <Button title='Remover Turma' onPress={handleGroupRemove} type='SECONDARY' />
    </Container>
  );
}

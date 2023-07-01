import { useState, useCallback } from 'react';
import GroupCard from '../../components/GroupCard';
import Header from '../../components/Header';
import HighLight from '../../components/HighLight';
import { Container } from './styles';
import { FlatList } from 'react-native';
import ListEmpty from '../../components/ListEmpty';
import Button from '../../components/Button';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { groupsGetAll } from '../../storage/group/groupsGetAll';
import { Loading } from '../../components/Loading';

export default function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState(Array<string>);
  const navigation = useNavigation();
  function handleNewGroup() {
    navigation.navigate('new');
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);

      const data = await groupsGetAll();
      setGroups(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group });
  }

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />
      <HighLight title='Turmas' subtitle='jogue com a sua turma' />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty message='Que tal cadastrar a primeira turma!' />
          )}
          renderItem={({ item }) => (
            <GroupCard onPress={() => handleOpenGroup(item)} title={item} />
          )}
        />
      )}
      <Button title='Cadastrar' onPress={handleNewGroup} />
    </Container>
  );
}

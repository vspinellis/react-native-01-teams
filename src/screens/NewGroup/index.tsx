import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import Header from '../../components/Header';
import HighLight from '../../components/HighLight';
import Input from '../../components/Input';
import { Container, Content, Icon } from './styles';
import { groupCreate } from '../../storage/group/groupCreate';
import { Alert } from 'react-native';
import { AppError } from '../../utils/appError';

export default function NewGroup() {
  const [groupId, setGroupId] = useState('');
  const navigation = useNavigation();

  async function handleNew() {
    try {
      if (groupId.trim().length === 0) {
        return Alert.alert('Novo grupo', 'informe algum valor');
      }
      await groupCreate(groupId);
      navigation.navigate('players', { group: groupId });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo Grupo', error.message);
      } else {
        Alert.alert('Novo Grupo', 'Erro ao criar o grupo');
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <HighLight title='Nova turma' subtitle='crie a turma para adicionar as pessoas' />
        <Input placeholder='Nome da turma' onChangeText={setGroupId} />
        <Button style={{ marginTop: 20 }} title='Criar' onPress={handleNew} />
      </Content>
    </Container>
  );
}

import { TouchableOpacityProps } from 'react-native';
import { Container, FilterStyleProps, Title } from './styles';

type Props = TouchableOpacityProps &
  FilterStyleProps & {
    title: string;
  };

export default function Filter({ title, isActive = false, ...rest }: Props) {
  return (
    <Container {...rest} isActive={isActive}>
      <Title>{title}</Title>
    </Container>
  );
}

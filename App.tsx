import Groups from './src/screens/Groups';
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';
import theme from './src/theme';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Loading } from './src/components/Loading';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/app.routes';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
        {fontsLoaded ? <AppRoutes /> : <Loading />}
      </NavigationContainer>
    </ThemeProvider>
  );
}

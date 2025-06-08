import { TouchableOpacity } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import { ThemedText } from '../../components/ThemedText';
import { IScreenProps } from '../../types/screen';

const HomeScreen = ({ navigation }: IScreenProps<'Home'>) => {
  return (
    <ScreenLayout>
      <ThemedText>Home</ThemedText>
      <TouchableOpacity onPress={() => navigation.replace('SignIn')}>
        <ThemedText>SignIn</ThemedText>
      </TouchableOpacity>
    </ScreenLayout>
  );
};

export default HomeScreen;

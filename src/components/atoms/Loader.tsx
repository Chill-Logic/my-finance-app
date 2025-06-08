import { useThemeColor } from '../../hooks/useThemeColor';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '../atoms/ThemedView';

export function Loader() {
  const color = useThemeColor({}, 'text');

  return (
    <ThemedView>
      <ActivityIndicator size="small" color={color} />
    </ThemedView>
  );
}

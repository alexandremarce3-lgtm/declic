import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Animated, Easing } from 'react-native';
import { AppText } from '../AppText';

/** Compteur qui défile jusqu'à sa nouvelle valeur (XP). */
export function AnimatedNumber({
  value,
  format = String,
  ...text
}: { value: number; format?: (n: number) => string } & Omit<ComponentProps<typeof AppText>, 'children'>) {
  const anim = useRef(new Animated.Value(value)).current;
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setShown(Math.round(v)));
    Animated.timing(anim, { toValue: value, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => anim.removeListener(id);
  }, [value, anim]);

  return <AppText {...text}>{format(shown)}</AppText>;
}

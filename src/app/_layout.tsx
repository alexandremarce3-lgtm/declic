// Import graisse par graisse : seules ces 6 polices sont embarquées dans l'app
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display/600SemiBold';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display/700Bold';
import { PlayfairDisplay_700Bold_Italic } from '@expo-google-fonts/playfair-display/700Bold_Italic';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AchievementWatcher } from '@/components/achievements/AchievementWatcher';
import { RankUpOverlay } from '@/components/rank/RankUpOverlay';
import { XpToast } from '@/components/rank/XpToast';
import { I18nProvider, useI18n } from '@/i18n';
import { JournalProvider } from '@/storage/journal';
import { AgreementsProvider } from '@/storage/agreements';
import { ProgressProvider, useProgress } from '@/storage/progress';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppStack() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { ready, stored } = useProgress();
  const segments = useSegments();

  // Premier lancement (ou après « Tout effacer ») : écran d'accueil obligatoire
  const onboarded = Boolean(stored.profile.onboardedAt);
  const onWelcome = segments[0] === 'bienvenue' || segments[0] === 'legal';
  useEffect(() => {
    if (ready && !onboarded && !onWelcome) router.replace('/bienvenue');
  }, [ready, onboarded, onWelcome]);

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.serifSemi, fontSize: 18 },
          headerStyle: { backgroundColor: colors.bg },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="fiche/[id]" options={{ title: '' }} />
        <Stack.Screen name="defis" options={{ title: t.nav.challenges }} />
        <Stack.Screen name="sos" options={{ title: t.nav.sos }} />
        <Stack.Screen name="profil" options={{ title: t.nav.profile }} />
        <Stack.Screen name="carnet" options={{ title: t.nav.journal }} />
        <Stack.Screen name="avatar" options={{ title: t.nav.avatar }} />
        <Stack.Screen name="succes" options={{ title: t.nav.achievements }} />
        <Stack.Screen name="quiz/[tier]" options={{ title: t.nav.quiz }} />
        <Stack.Screen name="identite" options={{ title: t.nav.identity }} />
        <Stack.Screen name="parcours" options={{ title: t.nav.journey }} />
        <Stack.Screen name="sauvegarde" options={{ title: t.nav.backup }} />
        <Stack.Screen name="bienvenue" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="legal/[doc]" options={{ title: '' }} />
        <Stack.Screen name="collab/index" options={{ title: t.nav.collab }} />
        <Stack.Screen name="collab/faq" options={{ title: t.nav.faq }} />
        <Stack.Screen name="collab/charte" options={{ title: t.nav.charter }} />
        <Stack.Screen name="collab/accord" options={{ title: t.nav.agreement }} />
        <Stack.Screen name="collab/signer" options={{ title: t.nav.sign }} />
        <Stack.Screen name="modele/index" options={{ title: t.nav.model }} />
        <Stack.Screen name="modele/moodboard" options={{ title: t.nav.moodboard }} />
        <Stack.Screen name="modele/quiz" options={{ title: t.nav.lightQuiz }} />
      </Stack>
      <XpToast />
      <AchievementWatcher />
      <RankUpOverlay />
    </View>
  );
}

export default function RootLayout() {
  const { scheme, colors } = useTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  // Les clés doivent correspondre aux noms de `fonts` (theme/tokens.ts)
  const [loaded, error] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const ready = loaded || Boolean(error); // en cas d'échec : polices système, mais l'app démarre

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={{
          ...base,
          colors: {
            ...base.colors,
            background: colors.bg,
            card: colors.bg,
            text: colors.text,
            border: colors.border,
            primary: colors.primaryInk,
          },
        }}
      >
        <I18nProvider>
          <ProgressProvider>
            <JournalProvider>
              <AgreementsProvider>
              <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
              <AppStack />
              </AgreementsProvider>
            </JournalProvider>
          </ProgressProvider>
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

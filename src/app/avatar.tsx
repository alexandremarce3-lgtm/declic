import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/avatar/Avatar';
import { RankBadge } from '@/components/rank/RankBadge';
import { useGameState } from '@/hooks/useGameState';
import { useI18n } from '@/i18n';
import type { UiStrings } from '@/i18n/fr';
import { FACE_SLOTS, OPTIONAL_SLOTS, SLOT_GROUPS, type AvatarItem, type Slot, type Unlock } from '@/lib/avatar';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type GroupId = (typeof SLOT_GROUPS)[number]['id'];
type Item = AvatarItem & { unlocked: boolean };

/** Emplacements présentés en pastilles de couleur plutôt qu'en vignettes */
const SWATCH_SLOTS: Slot[] = ['skin', 'hairColor'];

function unlockLabel(u: Unlock, t: UiStrings) {
  const l = t.avatar.unlock;
  switch (u.kind) {
    case 'free':
      return l.free;
    case 'rank':
      return l.rank(u.rank);
    case 'challenges':
      return l.challenges(u.count);
    case 'sheets':
      return l.sheets(u.count);
    case 'sos':
      return l.sos(u.count);
    case 'photos':
      return l.photos(u.count);
    case 'achievement':
      return l.achievement;
  }
}

/** Vestiaire : aperçu, trois familles (personnage, visage, style), pièces verrouillées / débloquées. */
export default function AvatarScreen() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { stored, rank, equip } = useProgress();
  const { items } = useGameState();
  const insets = useSafeAreaInsets();
  const [group, setGroup] = useState<GroupId>('character');
  const [slot, setSlot] = useState<Slot>('body');

  const look = stored.look;
  const slots = SLOT_GROUPS.find((g) => g.id === group)!.slots;
  const inSlot = items.filter((i) => i.slot === slot);
  const unlockedCount = items.filter((i) => i.unlocked).length;
  const name = (id: string) => t.avatar.items[id as keyof UiStrings['avatar']['items']] ?? id;
  const crop = FACE_SLOTS.includes(slot);

  const choose = (item: Item | null) => {
    if (item && !item.unlocked) return;
    Haptics.selectionAsync().catch(() => {});
    equip(slot, item?.id ?? null);
  };

  /** Tire au hasard silhouette, visage et cheveux parmi les pièces disponibles */
  const shuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    for (const g of SLOT_GROUPS.filter((x) => x.id !== 'style')) {
      for (const s of g.slots) {
        const pool = items.filter((i) => i.slot === s && i.unlocked);
        const options: (string | null)[] = [...pool.map((i) => i.id), ...(OPTIONAL_SLOTS.includes(s) ? [null] : [])];
        if (options.length) equip(s, options[Math.floor(Math.random() * options.length)]);
      }
    }
  };

  const Chip = ({ label, active, onPress, strong }: { label: string; active: boolean; onPress: () => void; strong?: boolean }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={{
        minHeight: HIT - 8,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        justifyContent: 'center',
        backgroundColor: active ? (strong ? colors.primary : colors.text) : colors.surfaceAlt,
      }}
    >
      <AppText variant="caption" color={active ? (strong ? colors.onPrimary : colors.bg) : colors.text}>
        {label}
      </AppText>
    </Pressable>
  );

  const lockOverlay = (item: Item) =>
    !item.unlocked && (
      <View style={{ position: 'absolute', top: spacing.xs, right: spacing.xs }}>
        <AppText variant="caption" muted>
          🔒
        </AppText>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
      {/* Aperçu */}
      <View style={{ alignItems: 'center', paddingVertical: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
        <Avatar look={look} size={180} />
        <View style={{ position: 'absolute', top: spacing.md, right: spacing.md }}>
          <RankBadge rank={rank.rank} size={46} />
        </View>
        <Pressable
          onPress={shuffle}
          accessibilityRole="button"
          accessibilityLabel={t.avatar.shuffle}
          hitSlop={8}
          style={{ position: 'absolute', top: spacing.md, left: spacing.md, minHeight: HIT - 8, justifyContent: 'center' }}
        >
          <AppText variant="caption" color={colors.accentInk}>
            ⚄ {t.avatar.shuffle}
          </AppText>
        </Pressable>
        <AppText variant="caption" muted style={{ marginTop: spacing.sm }}>
          {t.avatar.unlockedCount(unlockedCount, items.length)}
        </AppText>
      </View>

      {/* Familles */}
      <View style={{ flexDirection: 'row', gap: spacing.sm }} accessibilityRole="tablist">
        {SLOT_GROUPS.map((g) => (
          <View key={g.id} style={{ flex: 1 }}>
            <Chip
              label={t.avatar.groups[g.id]}
              active={g.id === group}
              strong
              onPress={() => {
                setGroup(g.id);
                setSlot(g.slots[0]);
              }}
            />
          </View>
        ))}
      </View>

      {/* Emplacements de la famille */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }} accessibilityRole="tablist">
        {slots.map((s) => (
          <Chip key={s} label={t.avatar.slots[s]} active={s === slot} onPress={() => setSlot(s)} />
        ))}
      </ScrollView>

      {/* Pièces */}
      {SWATCH_SLOTS.includes(slot) ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingVertical: spacing.sm }}>
          {inSlot.map((item) => {
            const worn = look[slot] === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => choose(item)}
                accessibilityRole="button"
                accessibilityState={{ selected: worn, disabled: !item.unlocked }}
                accessibilityLabel={`${name(item.id)}${item.unlocked ? '' : `. ${t.avatar.locked} : ${unlockLabel(item.unlock, t)}`}`}
                style={{ alignItems: 'center', gap: 4, width: 64 }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: item.colors[0],
                    borderWidth: worn ? 3 : 1,
                    borderColor: worn ? colors.accent : colors.border,
                    opacity: item.unlocked ? 1 : 0.3,
                  }}
                />
                {lockOverlay(item)}
                <AppText variant="caption" numberOfLines={1} muted={!item.unlocked} style={{ fontSize: 11 }}>
                  {name(item.id)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {OPTIONAL_SLOTS.includes(slot) && (
            <Pressable
              onPress={() => choose(null)}
              accessibilityRole="button"
              accessibilityState={{ selected: look[slot] === null }}
              accessibilityLabel={t.avatar.none}
              style={{
                width: '31%',
                aspectRatio: 0.85,
                borderRadius: radius.md,
                borderWidth: look[slot] === null ? 2 : 1,
                borderColor: look[slot] === null ? colors.accent : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppText variant="title" muted>
                ∅
              </AppText>
              <AppText variant="caption" muted>
                {t.avatar.none}
              </AppText>
            </Pressable>
          )}
          {inSlot.map((item) => {
            const worn = look[slot] === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => choose(item)}
                accessibilityRole="button"
                accessibilityState={{ selected: worn, disabled: !item.unlocked }}
                accessibilityLabel={`${name(item.id)}. ${item.unlocked ? (worn ? t.avatar.equipped : '') : `${t.avatar.locked} : ${unlockLabel(item.unlock, t)}`}`}
                style={({ pressed }) => ({
                  width: '31%',
                  aspectRatio: 0.85,
                  padding: spacing.xs,
                  borderRadius: radius.md,
                  backgroundColor: colors.surface,
                  borderWidth: worn ? 2 : 1,
                  borderColor: worn ? colors.accent : colors.border,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View style={{ opacity: item.unlocked ? 1 : 0.25, flex: 1, justifyContent: 'center' }}>
                  <Avatar look={{ ...look, [slot]: item.id }} size={crop ? 78 : 70} crop={crop} />
                </View>
                {lockOverlay(item)}
                <AppText variant="caption" numberOfLines={1} color={item.unlocked ? colors.text : colors.textMuted}>
                  {name(item.id)}
                </AppText>
                {!item.unlocked && (
                  <AppText variant="overline" muted numberOfLines={2} style={{ fontSize: 9, lineHeight: 11, textAlign: 'center' }}>
                    {unlockLabel(item.unlock, t)}
                  </AppText>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

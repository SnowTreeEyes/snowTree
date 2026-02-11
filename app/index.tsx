import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 기존 프로젝트에서 제공하는 테마 컴포넌트 사용
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });
  const menuButtonRef = useRef<View>(null);
  const popupWidth = 220;
  const popupPadding = 8;
  const screen = useMemo(() => Dimensions.get('window'), []);

  const openMenu = useCallback(() => {
    if (!menuButtonRef.current) {
      setMenuVisible(true);
      return;
    }

    menuButtonRef.current.measureInWindow((x, y, width, height) => {
      const left = Math.min(
        Math.max(popupPadding, x + width - popupWidth - popupPadding),
        screen.width - popupWidth - popupPadding,
      );
      const top = Math.min(y + height + popupPadding, screen.height - popupPadding);
      setPopupPosition({ left, top });
      setMenuVisible(true);
    });
  }, [popupPadding, popupWidth, screen.height, screen.width]);

  const closeMenu = useCallback(() => setMenuVisible(false), []);
  return (
    <ThemedView style={styles.container}>
      {/* Header with Menu Button */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          ref={menuButtonRef}
          style={styles.menuButton}
          onPress={openMenu}
        >
          <MaterialIcons name="menu" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closeMenu} />
          <ThemedView style={[styles.modalContent, popupPosition]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>설정</ThemedText>
              <TouchableOpacity onPress={closeMenu}>
                <MaterialIcons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.menuItem}>
              <ThemedText>프로필</ThemedText>
            </ThemedView>
            <ThemedView style={styles.menuItem}>
              <ThemedText>알림</ThemedText>
            </ThemedView>
            <ThemedView style={styles.menuItem}>
              <ThemedText>로그아웃</ThemedText>
            </ThemedView>
          </ThemedView>
        </View>
      </Modal>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trophy Circle */}
        <View style={styles.trophyContainer}>
          <View style={styles.trophyCircle}>
            <MaterialIcons name="emoji-events" size={60} color="white" />
          </View>
          {/* Level Badge */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level</Text>
            <Text style={styles.levelNumber}>1</Text> {/* Level db에서 가져올 예정 */}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {/* Distance Stats */}
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <MaterialIcons name="directions-run" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.statLabel}>총 거리</Text>
            <Text style={styles.statValue}>0 km</Text> {/* 총 거리 db에서 가져올 예정 */}
          </View>

          {/* Experience Stats */}
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <MaterialIcons name="star" size={24} color="#FFC107" />
            </View>
            <Text style={styles.statLabel}>경험치</Text>
            <Text style={styles.statValue}>0%</Text> {/* 경험치 db에서 가져올 예정 */}
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '0%' }]} /> {/* 경험치에 따라 너비 조절 예정 */}
          </View>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.runButton]}>
          <Text style={styles.runButtonText}>RUN</Text> {/* 혼자 달리기 화면으로 전환 */}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.withRunButton]}>
          <Text style={styles.withRunButtonText}>With RUN</Text> {/* 같이 달리기 화면으로 전환 모양 살짝 다름 순위 표시됨 */}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 30,
  },
  trophyContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  trophyCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -20,
  },
  levelBadge: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 35,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  levelNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    marginVertical: 40,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    width: '80%',
    marginVertical: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  runButton: {
    backgroundColor: '#10B981',
  },
  runButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  withRunButton: {
    backgroundColor: '#3B82F6',
  },
  withRunButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  modalContent: {
    position: 'absolute',
    width: 220,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 24,
  },
  menuItem: {
    paddingVertical: 12,
  },

});
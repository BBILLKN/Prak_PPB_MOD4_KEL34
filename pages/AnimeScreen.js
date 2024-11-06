import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const AnimeScreen = () => {
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSeasonalAnime();
    fetchTopAnime();
  }, []);

  useEffect(() => {
    fetchTopAnime();
  }, [page]);

  const fetchSeasonalAnime = async () => {
    try {
      const response = await axios.get('https://api.jikan.moe/v4/seasons/now');
      setSeasonalAnime(response.data.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching seasonal anime:', error);
    }
  };

  const fetchTopAnime = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page}`);
      setTopAnime(response.data.data);
    } catch (error) {
      console.error('Error fetching top anime:', error);
    }
  };

  const renderSeasonalAnimeItem = ({ item }) => (
    <View style={styles.seasonalAnimeItem}>
      <Image source={{ uri: item.images.jpg.image_url }} style={styles.animeImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <Text style={styles.animeTitle} numberOfLines={2}>{item.title}</Text>
      </LinearGradient>
    </View>
  );

  const renderTopAnimeItem = ({ item }) => (
    <View style={styles.topAnimeItem}>
      <Image source={{ uri: item.images.jpg.image_url }} style={styles.topAnimeImage} />
      <View style={styles.topAnimeInfo}>
        <Text style={styles.topAnimeTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: </Text>
          <Text style={styles.scoreValue}>{item.score}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.mainTitle}>Animelist Kel34</Text>
        
        <Text style={styles.sectionTitle}>This Season</Text>
        <FlatList
          data={seasonalAnime}
          renderItem={renderSeasonalAnimeItem}
          keyExtractor={(item) => item.mal_id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.seasonalListContainer}
        />
        
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.paginationButton, page === 1 && styles.paginationButtonDisabled]} 
            onPress={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            <Text style={styles.paginationButtonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.paginationButton} 
            onPress={() => setPage(prev => prev + 1)}
          >
            <Text style={styles.paginationButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Top Anime</Text>
        <FlatList
          data={topAnime}
          renderItem={renderTopAnimeItem}
          keyExtractor={(item) => item.mal_id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginVertical: 16,
  },
  seasonalListContainer: {
    paddingRight: 16,
  },
  seasonalAnimeItem: {
    width: 150,
    height: 225,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  animeImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  animeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  topAnimeItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topAnimeImage: {
    width: 100,
    height: 150,
  },
  topAnimeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  topAnimeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 14,
    color: '#666',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  paginationButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '45%',
  },
  paginationButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AnimeScreen;
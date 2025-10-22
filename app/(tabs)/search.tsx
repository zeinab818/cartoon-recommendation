import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";

import { images } from "../../constants/images";
import MovieCard from "../../components/MovieCard";
import { fetchMovies } from "../../services/api";
import useFetch from "../../services/useFetch";
import { icons } from "../../constants/icons";
import SearchBar from "../../components/SearchBar";
import { updateSearchCount } from "../../services/appwrite";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");


  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

 useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();

        // Call updateSearchCount only if there are results
        if (movies?.length! > 0 && movies?.[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        }
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  const renderMovie = ({ item }: any) => {
    if (!item?.poster_path || !item?.title) return null;
    return <MovieCard {...item} />;
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      <FlatList
        data={movies || []}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          paddingVertical: 16,
          marginBottom: 20,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10 mb-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#00bcd4"
                className="my-3"
              />
            )}

            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {moviesError.message}
              </Text>
            )}

            {!moviesLoading &&
              !moviesError &&
              searchQuery.trim().length >= 3 &&
              movies?.length! > 0 && (
                <Text className="text-xl text-white font-bold mb-6 px-5">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-400">
                {searchQuery.trim().length >= 3
                  ? "No movies found for this search"
                  : "Start typing to search for movies 🎬"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});

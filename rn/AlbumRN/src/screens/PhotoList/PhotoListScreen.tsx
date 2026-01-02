import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect } from "react";
import { usePhotoListViewModel } from "./usePhotoListViewModel";
import { Ionicons } from "@expo/vector-icons";
import { Photo } from "../../types/photoTypes";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const ITEM_SPACING = 2;
const ITEM_SIZE = (width - ITEM_SPACING * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

const PhotoListScreen: React.FC = () => {
  const navigation = useNavigation();

  const {
    photos,
    isLoading,
    isUploading,
    uploadablePhotos,
    showUploadModal,
    handleLoadMore,
    handlePickImages,
    handleCloseUploadModal,
    handleUpload,
    handleDescriptionChange,
    handleRefresh,
    albumTitle: title,
  } = usePhotoListViewModel();

  useEffect(() => {
    handleRefresh();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => console.log("Show Members")}
            style={styles.headerBtn}
          >
            <Ionicons name="people" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickImages} style={styles.headerBtn}>
            <Ionicons name="images-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, title, handlePickImages]);

  const renderItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => console.log("Detail : ", item.photo_path)}
    >
      <Image style={styles.image} source={{ uri: photoUrl(item.photo_path) }} />
    </TouchableOpacity>
  );

  const photoUrl = (path: string): string => {
    let photoPath = path.replace("uploads/imgs/", "");
    return `http://127.0.0.1:3100/image/${photoPath}`;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.photo_key}
        numColumns={COLUMN_COUNT}
        columnWrapperStyle={{ gap: ITEM_SPACING }}
        contentContainerStyle={{ gap: ITEM_SPACING }}
        // onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="small" style={{ margin: 20 }} />
          ) : null
        }
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "white", marginTop: 10 }}>업로드 중...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerButtons: { flexDirection: "row", marginRight: 10 },
  headerBtn: { marginLeft: 15 },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#eee",
    resizeMode: "cover",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PhotoListScreen;

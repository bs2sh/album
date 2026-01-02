import React, { useCallback, useRef, useState, useLayoutEffect } from "react";
import { Alert, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/NavigationTypes";
import { Photo, UploadablePhoto } from "../../types/photoTypes";
import { Ionicons } from "@expo/vector-icons"; // 아이콘 사용을 위해 import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPhotoList, uploadPhoto } from "../../api/photoAPI";
import * as ImagePicker from "expo-image-picker";

type PhotoListRouteProp = RouteProp<RootStackParamList, "PhotoList">;

interface PhotoListViewModel {
  photos: Photo[];
  isLoading: boolean;
  isUploading: boolean;
  uploadablePhotos: UploadablePhoto[];
  showUploadModal: boolean;

  handleLoadMore: () => void;
  handlePickImages: () => void;
  handleCloseUploadModal: () => void;
  handleUpload: (photos: UploadablePhoto[]) => void;
  handleDescriptionChange: (id: string, text: string) => void;
  handleRefresh: () => void;

  albumTitle: string;
}

export const usePhotoListViewModel = (): PhotoListViewModel => {
  const navigation = useNavigation();
  const route = useRoute<PhotoListRouteProp>();
  // 파라미터로 받은거.
  const { albumKey, title } = route.params;

  const [photos, setPhotos] = useState<Photo[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadablePhotos, setUploadablePhotos] = useState<UploadablePhoto[]>(
    []
  );
  const [showUploadModal, setShowUploadModal] = useState(false);

  const lastPhotoKeyRef = useRef<string>("");
  const isEndReachedRef = useRef(false);

  const fetchPhotos = async (isRefresh = false) => {
    if (isLoading) return;
    if (!isRefresh && isEndReachedRef.current) return;

    setIsLoading(true);

    try {
      const userKeyStr = await AsyncStorage.getItem("userKey");
      const userKey = parseInt(userKeyStr, 10);

      const currentLastKey = isRefresh ? "" : lastPhotoKeyRef.current;
      // api 요청
      const response = await getPhotoList(userKey, albumKey, currentLastKey);
      if (response.result === 1) {
        // 제대로 받음.
        const newPhotos = response.data.list;
        //
        if (newPhotos.length === 0) {
          isEndReachedRef.current = true;
        } else {
          lastPhotoKeyRef.current = newPhotos[newPhotos.length - 1].photo_key;

          if (isRefresh) {
            setPhotos(newPhotos);
            isEndReachedRef.current = false;
          } else {
            setPhotos((prev) => [...prev, ...newPhotos]);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(() => {
    fetchPhotos(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchPhotos(false);
  }, []);

  // 이미지 선택
  const handlePickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // 접근 권한 없음.
    if (status !== "granted") {
      Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5, // 최대 5장 선택 가능
    });

    if (!result.canceled) {
      const newUploadables = result.assets.map((asset) => ({
        id: asset.assetId || Math.random().toString(),
        uri: asset.uri,
        description: "",
      }));
      setUploadablePhotos(newUploadables);
      setShowUploadModal(true);
    } else {
      return;
    }
  };

  const handleUpload = async (items: UploadablePhoto[]) => {
    if (items.length === 0) return;

    setIsUploading(true);
    try {
      const userKeyStr = await AsyncStorage.getItem("userKey");
      const userKey = userKeyStr ? parseInt(userKeyStr, 10) : -1;
      const userNick = "Guest";

      // UI용 모델(UploadablePhoto)을 API용 파라미터로 변환
      const photosToUpload = items.map((item) => ({
        uri: item.uri,
        description: item.description,
      }));

      // 한 번의 API 호출로 모든 사진 전송
      const response = await uploadPhoto(
        userKey,
        userNick,
        albumKey,
        photosToUpload
      );

      if (response.result === 1) {
        Alert.alert("성공", "모든 사진이 업로드되었습니다.");
        setShowUploadModal(false);
        setUploadablePhotos([]);
        handleRefresh(); // 리스트 갱신
      } else {
        Alert.alert("실패", response.msg);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "업로드 중 문제가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setUploadablePhotos([]);
  };

  const handleDescriptionChange = (id: string, text: string) => {
    setUploadablePhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, description: text } : p))
    );
  };

  return {
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
  };
};

// 헤더 버튼 스타일 (ViewModel 파일 하단에 정의)
const styles = StyleSheet.create({
  headerButtons: { flexDirection: "row", marginRight: 10 },
  headerBtn: { marginLeft: 15 },
});

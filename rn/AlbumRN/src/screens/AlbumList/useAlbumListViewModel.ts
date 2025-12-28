import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Album } from "../../types/albumTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/NavigationTypes";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { joinalbums, createAlbum } from "../../api/albumAPI";

interface AlbumListViewModel {
  albums: Album[];
  isLoading: boolean;
  handleCreateAlbum: () => void;
  handleMyInfo: () => void;
  handleInviteList: () => void;
  handlePhotoList: (album: Album) => void;
}

export const useAlbumListViewModel = (): AlbumListViewModel => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 화면이 포커스될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      fetchAlbums();
    }, [])
  );

  const fetchAlbums = async () => {
    console.log("fetchAlbums >>>>>>>>");
    setIsLoading(true);

    try {
      // 저장된 유저키 가져온다.
      const userKeyString = await AsyncStorage.getItem("userKey");

      if (!userKeyString) {
        // 유저키 없음.
        Alert.alert("", "사용자 정보가 없습니다.");
        return;
      }
      // userKeyString 을 number로 변경
      const userKey = parseInt(userKeyString, 10);
      if (isNaN(userKey)) {
        Alert.alert("", "사용자 정보가 올바르지 않습니다.");
        return;
      }
      // joinAlbums API 호출
      console.log("user key :: ", userKey);
      const response = await joinalbums(userKey);
      if (response.result === 1) {
        // 제대로 받았음.
        console.log(`response ...... ${JSON.stringify(response)}`);
        setAlbums(response.albums);
      } else {
        Alert.alert("", response.msg);
        setAlbums([]);
      }
    } catch (e) {
      console.error("오류", e);
      Alert.alert("오류", "앨범 목록을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAlbum = () => navigation.navigate("CreateAlbum");
  const handleMyInfo = () => navigation.navigate("MyInfo");
  const handleInviteList = () => navigation.navigate("InviteList");
  const handlePhotoList = (album: Album) => {
    navigation.navigate("PhotoList", {
      albumKey: album.album_key,
      title: album.title,
    });
  };

  return {
    albums,
    isLoading,
    handleCreateAlbum,
    handleMyInfo,
    handleInviteList,
    handlePhotoList,
  };
};

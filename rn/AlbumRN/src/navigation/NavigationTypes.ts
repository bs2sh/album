// 앱에 있는 모든 화면의 이름과 파라미터를 정의
// undefine은 파라미터 없음.
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;

  AlbumList: undefined; // 앨범 리스트 (메인)
  PhotoList: { albumKey: string; title: string }; // 앨범 상세 (파라미터 전달 예시)
  InviteList: undefined; // 초대 리스트
  CreateAlbum: undefined; // 앨범 만들기 (모달)
  MyInfo: undefined; // 내 정보
};

//
//  AlbumView.swift
//  Album
//
import SwiftUI
import PhotosUI
import UIKit
// Kingfisher는 이 뷰에서 더 이상 직접 사용하지 않습니다.
// import Kingfisher

struct PhotoListView: View {
    @AppStorage("userkey") var userKey: Int?
    @EnvironmentObject var userViewModel: UserViewModel
    
    @State var album: Album?
    @State private var selectedItems: [PhotosPickerItem] = []
    let maxImageSelection = 5
    
    @State var presentMembers: Bool = false
    
    @StateObject private var viewModel = PhotoListViewModel()
    
    let columns = [GridItem(.adaptive(minimum: 100))]
    
    @State private var selectedPhoto: Photo?
    
    // Paging: 다음 페이지 로딩 중복 방지를 위한 상태 변수
    @State private var isLoadingNextPage = false
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 5) {
                ForEach(viewModel.photoList) { photo in
                    photoCell(for: photo) // 이미지 셀을 위한 뷰 빌더 사용
                        .onTapGesture {
                            if selectedPhoto == nil {
                                selectedPhoto = photo
                            }
                        }
                        .onAppear {
                            // 마지막 사진이 보이면 다음 페이지 로드
                            if photo.id == viewModel.photoList.last?.id {
                                loadNextPage()
                            }
                        }
                }
            }
            .padding(.horizontal, 5)
        }
        .navigationDestination(item: $selectedPhoto) { photo in
            PhotoDetailView(photo: photo)
        }
        .navigationTitle(album?.title ?? "앨범")
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarTitleTextColor(.black)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                HStack {
                    Button {
                        presentMembers.toggle()
                    } label: {
                        Image(systemName: "person.2")
                    }
                    
                    PhotosPicker(
                        selection: $selectedItems,
                        maxSelectionCount: maxImageSelection,
                        matching: .images,
                        photoLibrary: .shared()) {
                            Image(systemName: "photo.on.rectangle")
                        }
                }
            }
        }
        .fullScreenCover(isPresented: $presentMembers) {
            MembersView(album: album)
        }
        .toolbarRole(.editor)
        .onAppear {
            // 뷰가 처음 나타날 때, 사진 목록이 비어있으면 첫 페이지를 로드합니다.
            if viewModel.photoList.isEmpty {
                if let userKey = userKey, let album = album {
                    viewModel.photoList(userKey: userKey, albumKey: album.albumkey, lastPhotoKey: "")
                }
            }
        }
        .onChange(of: selectedItems) { _, newItems in
            guard !newItems.isEmpty else { return }

            Task {
                var images: [UIImage] = []
                for item in newItems {
                    if let data = try? await item.loadTransferable(type: Data.self),
                       let image = UIImage(data: data) {
                        images.append(image)
                    }
                }
                
                selectedItems = []
                
                if let userKey = userKey,
                   let nick = userViewModel.user?.nick,
                   let albumkey = album?.albumkey {
                    viewModel.uploadPhoto(userkey: userKey, usernick: nick, albumkey: albumkey, images: images)
                }
            }
        }
        .onChange(of: viewModel.uploadResult) {
            if $1?.result == 1 {
                if let albumKey = album?.albumkey,
                   let userKey = userKey {
                    viewModel.refreshPhotoList(userKey: userKey, albumKey: albumKey)
                }
            }
        }
        .onChange(of: viewModel.photoList) { _, _ in
             // 사진 목록이 업데이트되면, 다음 페이지 로딩이 가능하도록 상태를 초기화합니다.
             isLoadingNextPage = false
        }
        .alert(viewModel.errMsg ?? "사진 업로드 에러", isPresented: $viewModel.uploadErrorAlert) {
            Button("확인", role: .cancel) {}
        }
    }
    
    /// 개별 사진 셀을 그리는 뷰 빌더입니다. `AsyncImage`를 사용합니다.
    @ViewBuilder
    private func photoCell(for photo: Photo) -> some View {
        let imageUrl = photoUrl(photoPath: photo.photopath)
        
        AsyncImage(url: imageUrl) { phase in
            switch phase {
            case .success(let image):
                // 이미지 로딩 성공
                image
                    .resizable()
                    .aspectRatio(1, contentMode: .fill)
            case .failure:
                // 이미지 로딩 실패
                Color.gray.opacity(0.3)
                    .overlay(Image(systemName: "wifi.slash").foregroundColor(.white))
            case .empty:
                // 로딩 중일 때 보여줄 플레이스홀더
                Color.gray.opacity(0.1)
            @unknown default:
                EmptyView()
            }
        }
        .clipped()
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
    
    /// 다음 페이지의 사진 목록을 불러오는 함수입니다.
    private func loadNextPage() {
        guard !isLoadingNextPage else { return }
        
        guard let lastPhotoKey = viewModel.photoList.last?.photokey else { return }
        
        isLoadingNextPage = true
        if let userKey = userKey, let album = album {
            viewModel.photoList(userKey: userKey, albumKey: album.albumkey, lastPhotoKey: lastPhotoKey)
        }
    }
}

#Preview {
    NavigationStack {
        PhotoListView()
            .environmentObject(UserViewModel())
    }
}


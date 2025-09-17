//
//  AlbumView.swift
//  Album
//
//  Created by shbaek on 7/14/25.
//
import SwiftUI
import PhotosUI
import UIKit
import Kingfisher

struct PhotoListView: View {
    @AppStorage("userkey") var userKey: Int?
    @EnvironmentObject var userViewModel: UserViewModel
    
    @State var album: Album?
    @State private var selectedItems: [PhotosPickerItem] = []
    @State private var selectedImages: [Image] = []
    let maxImageSelection = 5 // 최대 선택 가능 이미지 개수
    
    @State var presentMembers: Bool = false
    
    @StateObject private var viewModel = PhotoListViewModel()
    
    let columns = [GridItem(.adaptive(minimum: 80))]
    
    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: columns, spacing: 10) {
                    ForEach(viewModel.photoList) { photo in
                        let imageUrl = photoUrl(photoPath: photo.photopath)
                        
                        NavigationLink {
                            let _ = print(photo)
                            PhotoDetailView(photo: photo)
                        } label: {
                            KFImage(imageUrl)
                                .placeholder {
                                    ProgressView()
                                }
                                .resizable()
                                .scaledToFill()
                                .frame(width: 100, height: 100)
                                .clipped()
//                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                }
            }
            .navigationTitle(album?.title ?? "앨범")
            .navigationBarTitleDisplayMode(.large)
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
        }
        .fullScreenCover(isPresented: $presentMembers, content: {
            MembersView(album: album)
        })
//        .sheet(isPresented: $presentMembers) {
//            
//        } content: {
//            MembersView(album: album)
//        }
        .toolbarRole(.editor)
        .onAppear {
            let lastPhotoKey: String = {
                if viewModel.photoList.count > 0 {
                    return viewModel.photoList.last!.photokey
                } else {
                    return ""
                }
            }()
            
            if let userKey = userKey, let album = album {
                viewModel.photoList(userKey: userKey, albumKey: album.albumkey, lastPhotoKey: lastPhotoKey)
            }
            
        }
        .onChange(of: selectedItems) {
            print("select image count : \(selectedItems.count)")
            var images: [UIImage] = []
            Task {
                for item in selectedItems {
                    if let data = try? await item.loadTransferable(type: Data.self),
                       let image = UIImage(data: data) {
                        images.append(image)
                    }
                }
                
                if let userKey = userKey,
                   let nick = userViewModel.user?.nick,
                   let albumkey = album?.albumkey {
                    viewModel.uploadPhoto(userkey: userKey, usernick: nick, albumkey: albumkey, images: images)
                }
            }
        }
        .onChange(of: viewModel.uploadResult) {
            if viewModel.uploadResult?.result == 1 {
                // 여기서 이미지 다시 받아오자.
                if let albumKey = album?.albumkey,
                   let userKey = userKey {
                    viewModel.refreshPhotoList(userKey: userKey, albumKey: albumKey)
                }
            }
        }
        // 업로드 에러 얼럿
        .alert(viewModel.errMsg ?? "사진 업로드 에러",
               isPresented: $viewModel.uploadErrorAlert) {
        }
    }
}

#Preview {
//    let album = Album(albumkey: UUID().uuidString, title: "테스트 앨범", members: "3,4,5", owner: 3, enable: 1)
    
//    AlbumView(album: album)
    PhotoListView()
}

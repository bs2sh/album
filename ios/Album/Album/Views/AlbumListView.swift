//
//  AlbumListView.swift
//  Album
//
//  Created by shbaek on 7/8/25.
//
import SwiftUI

struct AlbumListView: View {
    @AppStorage("userkey") var userkey: Int?
    
    @State var showCreate = false
    @StateObject var viewModel = AlbumViewModel()
    @State var pushToMyInfo: Bool = false
    
    var body: some View {
        VStack {
            // 내가 가입한 앨범
            List {
                ForEach(viewModel.joinAlbums?.albums ?? []) { album in
                    NavigationLink {
                        PhotoListView(album: album)
                    } label: {
                        Text(album.title)
                            .font(.system(size: 20))
                    }
                    .font(.system(size: 22))
                    .foregroundStyle(.white)
                    .listRowBackground(Color.white.opacity(0.1))
                    
                }
                
            }
            .background(Color.clear)
//            .navigationTitle("내 앨범")
            .navigationBarTitleDisplayMode(.inline)
//            .navigationBarTitleColor(.white)
            .scrollContentBackground(.hidden)
            
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("내앨범")
                        .font(.headline) // 폰트도 원하는 대로 설정 가능
                        .foregroundColor(.black)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack {
                        
                        // 받은/보낸 초대 리스트
                        NavigationLink {
                            InviteListView()
                        } label: {
                            Image(systemName: "envelope")
                                .tint(.white)
                        }
                        
                        .sheet(isPresented: $showCreate) {
                            viewModel.joinAlbums(userkey: userkey ?? -1)
                        } content: {
                            CreateAlbumView()
                        }
                    }
                    
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        pushToMyInfo.toggle()
                    } label: {
                        Text("내정보")
                    }
                }
            }
            .navigationDestination(isPresented: $pushToMyInfo) {
                MyInfoView()
            }
            
            // 앨범 만들기 버튼
            Button {
                showCreate.toggle()
            } label: {
                Text("앨범 만들기")
                    .foregroundStyle(.white)
                    .font(.system(size: 15).bold())
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .padding()
                
                
            }
            .frame(maxWidth: .infinity, maxHeight: 40)
            .overlay {
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.white, lineWidth: 2)
            }
            .padding(.horizontal, 40)
            
            Spacer()
            
        }
        .onAppear {
            print("onAppear : \(userkey ?? -1)")
            viewModel.joinAlbums(userkey: userkey ?? -1)
        }
        .alert(viewModel.errorMsg ?? "잠시 후 다시 시도해 주세요.", isPresented: $viewModel.showErrorAlert) {
            
        }
        .backgroundImage(imageName: "bg")
        
    }
    
    
}


#Preview {
    AlbumListView()
}

//
//  PhotoDetailView.swift
//  Album
//
//  Created by shbaek on 7/24/25.
//

import SwiftUI
import Kingfisher

struct PhotoDetailView: View {
    @State var photo: Photo?
    
    @State private var scale: CGFloat = 1.0
    @State private var lastScale: CGFloat = 1.0
    
    @State private var showCommentOverlay = false
    @StateObject private var viewModel = PhotoDetailViewModel()
    
    var body: some View {
        
        ZStack {
//            ImageZoomView(imageUrl: photoUrl(photoPath: photo?.photopath ?? ""))
            UIZoomView(imageUrl: photoPath(path: photo?.photopath ?? ""))
            
            VStack {
                Spacer()
                
                if showCommentOverlay == false {
                    Button {
                        showCommentOverlay.toggle()
                    } label: {
                        
                        HStack {
                            Image(systemName: "message.fill")
                            if showCommentOverlay {
                                Text("댓글 숨기기")
                            } else {
                                Text("댓글 보기 (\(viewModel.commentList.count))")
                            }
                        }
                        .font(.headline)
                        .foregroundStyle(.white)
                        .padding()
                        .background(.black.opacity(0.5))
                        .clipShape(.capsule)
                        .shadow(radius: 10)
                    }
                }
                
                if showCommentOverlay {
                    CommentOverlayView(viewModel: viewModel, isPresented: $showCommentOverlay, photo: photo)
                        .transition(.move(edge: .bottom))
                }
            }
            .animation(.spring(), value: showCommentOverlay)
            .navigationTitle("상세보기")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear {
                if let photo = photo {
                    viewModel.fetchCommentList(photoKey: photo.photokey)
                }
            }
        }
    }
}

// MARK: - 댓글

struct CommentOverlayView : View {
    @AppStorage("userkey") var userKey: Int?
    @StateObject var viewModel: PhotoDetailViewModel
    @Binding var isPresented: Bool
    let photo: Photo?
    
    @State private var comments: [Comment] = [
        Comment(commentKey: 600, ownerKey: 4, ownerNick: "myname", comment: "ㄷㅐㅅㄱㅡㄹㅇㅣㅂㄴㅣㄷㅏ.2", regdt: 1758465646343.0),
         Comment(commentKey: 700, ownerKey: 5, ownerNick: "myname", comment: "ㄷㅐㅅㄱㅡㄹㅇㅣㅂㄴㅣㄷㅏ.2", regdt: 1758465739331.0),
        Comment(commentKey: 800, ownerKey: 6, ownerNick: "myname", comment: "ㄷㅐㅅㄱㅡㄹㅇㅣㅂㄴㅣㄷㅏ.2", regdt: 1758465805871.0)
    ]
    
    @State private var newCommentText: String = ""
    
    var body: some View {
        ZStack(alignment: .bottom) {
            // 반투명 배경 (탭하면 뷰가 닫힘)
            Color.black.opacity(0.1)
                .edgesIgnoringSafeArea(.all)
                .cornerRadius(10, corners: [.topLeft, .topRight])
                .onTapGesture {
                    closeView()
                }
            VStack(spacing: 0) {
                // 상단 핸들 및 닫기 버튼
                headerView

                    // 사진 정보 뷰 추가
                VStack(spacing: 0) {
                    
                    List {
                        PhotoInfoView
                            .listRowBackground(Color.clear)
                        ForEach(viewModel.commentList) { comment in
                            HStack(alignment: .top) {
                                VStack(alignment: .leading) {
                                    HStack {
                                        Text(comment.ownerNick)
                                            .font(.headline)
                                        Text(formattedDate(from: comment.regdt / 1000))
                                            .font(.caption)
                                    }
                                    Text(comment.comment)
                                        .font(.subheadline)
                                }
                                
                                Spacer()
                            }
                            .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                                if let userKey = userKey, comment.ownerKey == userKey {
                                    Button(role: .destructive) {
                                        withAnimation {
                                            viewModel.deleteComment(commentKey: comment.commentKey)
                                        }
                                    } label: {
                                        Label("삭제", systemImage: "trash.fill")
                                    }
                                }
                            }
                            .listRowBackground(Color.clear)
                        }
                    }
                    .listStyle(.plain)
                    
                }
                // 댓글 리스트뷰
//                commentListView
                
                Divider()
                
                commentInputView
            }
            .cornerRadius(20, corners: [.topLeft, .topRight])
            .frame(maxHeight: UIScreen.main.bounds.height * 0.7)
            .background(.thinMaterial)
//            .edgesIgnoringSafeArea(.bottom)
        }
        .alert(viewModel.alertMsg, isPresented: $viewModel.alert) {
            Button("확인") {
                newCommentText = ""
            }
        }

    }
    
    //  상단 핸들 및 닫기 버튼 뷰
    private var headerView: some View {
        HStack {
            Spacer()
            VStack(spacing: 4) {
                Capsule()
                    .frame(width: 40, height: 5)
                    .foregroundColor(.secondary)
            }
            Spacer()
        }
        .padding()
        .contentShape(Rectangle())
        .gesture(
            // 아래로 스와이프하여 닫기
            DragGesture().onEnded({ value in
                if value.translation.height > 50 {
                    closeView()
                }
            })
        )
    }
//  MARK: - 사진 정보 뷰
    @ViewBuilder
    private var PhotoInfoView: some View {
        if let photo = photo {
            VStack(alignment: .leading, spacing: 8) {
//            VStack {
                
                // 등록한 사람 닉네임
                HStack(alignment: .bottom) {
                    Text(photo.ownernick)
                        .font(.headline)
                        .fontWeight(.bold)
                    Text(formattedDate(from: Double(photo.regdt) / 1000))
                        .font(.caption2)
                }
                
                Divider()
                    .background(.gray.opacity(0.5))
                
                // 사진 설명.
                Text(photo.description)
                    .font(.subheadline)
                    .foregroundStyle(.primary.opacity(0.9))
                    .padding(.top, 4)
                    
            }
            
            .padding([.bottom])
        }
    }
     
    
    
    
// MARK: - 댓글 목록 뷰
    /*
    private var commentListView: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 15) {
//                ForEach(viewModel.commentList, id: \.self) { comment in
                ForEach(comments , id: \.self) { comment in
                    HStack(alignment: .top) {
                        Image(systemName: "person.crop.circle.fill")
                            .font(.title)
                            .foregroundStyle(.gray)
                        VStack(alignment: .leading) {
                            HStack {
                                Text(comment.ownerNick)
                                    .font(.headline)
                                Text(formattedDate(from: comment.regdt))
                                    .font(.caption)
//                                    .foregroundColor(.secondary)
                            }
                            Text(comment.comment)
                                .font(.subheadline)
                        }
                    }
                }
            }
            .padding()
        }
    }
     */
//  MARK: - 댓글 입력 뷰
    private var commentInputView: some View {
        HStack(spacing: 15) {
            
            // 댓글 입력창
            TextField("댓글 입력", text: $newCommentText)
                .textFieldStyle(.plain)
                .padding(10)
                .background(Color(.systemGray6))
                .cornerRadius(15)
                .autocorrectionDisabled()
//                .keyboardType(.asciiCapable)
            
            // 댓글 등록 버튼
            Button(action: addComment) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.largeTitle)
                    .buttonStyle(.plain)
                    .tint(.accentColor)
            }
            .disabled(newCommentText.isEmpty)
        }
        .padding()
    }
    
    // 댓글 추가
    private func addComment() {
        if let userKey = userKey,viewModel.photoKey.isEmpty == false {
            viewModel.addComment(userKey: userKey, photoKey: viewModel.photoKey, comment: newCommentText)
        }
        hideKeyboard()
    }
    
    // 댓글 리스트 뷰 숨김
    private func closeView() {
        withAnimation(.spring()) {
            isPresented = false
        }
        hideKeyboard()
    }
}



#Preview {
    let photo = Photo(photokey: "ef6a3309-bf53-4b48-8b76-fa88afb6c318", photopath: "uploads/imgs/1753156284536-image1.jpg", owner: 3, ownernick: "xxxcc", albumkey: "197be471-4109-4602-8041-b3bdda77baf7", regdt: 1758465739331, description: "설명은 이거에요.")
    PhotoDetailView(photo: photo)
        
}

#Preview {
    @Previewable @State var isPresented = true
    let photo = Photo(photokey: "f3b86da9-f609-4123-b659-dd1fb866e283", photopath: "uploads/imgs/1753156284552-image2.jpg", owner: 3, ownernick: "xxxcc", albumkey: "197be471-4109-4602-8041-b3bdda77baf7", regdt: 1753156284559, description: "설명은 이거에요.")
    CommentOverlayView(viewModel: PhotoDetailViewModel(), isPresented: $isPresented, photo: photo)
}


#if canImport(UIKit)
extension View {
    func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}
#endif

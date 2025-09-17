//
//  MemberSearchView.swift
//  Album
//
//  Created by shbaek on 8/6/25.
//

import SwiftUI

struct MemberSearchView: View {
    @AppStorage("userkey") var userKey: Int?
    @State private var searchText: String = ""
    @StateObject private var viewModel = MemberSearchViewModel()
    @State var album: Album?
    @State var items: [User] = [
        User(userKey: 1, email: "anslei@assjjsljl.com", nick: "aaaxxx", albums: ""),
        User(userKey: 1, email: "ansi@asljl.com", nick: "닉네임입니다.", albums: ""),
        User(userKey: 1, email: "ansei@assjjsljl.com", nick: "부르르르르", albums: ""),
        User(userKey: 1, email: "anslei@assjjsljl.com", nick: "aa 썬샤인", albums: ""),
        User(userKey: 1, email: "anslei@assjjsl.com", nick: "오늘흐림", albums: ""),
    ]
    
    @State var alert: Bool = false
    var alertMsg: String? = ""
    @State var recvUserKey: Int = 0 // 초대받는 사람 유저키
    @State var presentPopup: Bool = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                List {
                    ForEach(items) { item in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(item.nick)
                                    .padding(.top, 5)
                                Text(item.email)
                                    .padding(.top, 5)
                            }
                            Spacer()
                            Button {
                                // 초대 메시지 입력 팝업
                                recvUserKey = item.userKey
                                withAnimation(.spring()) {
                                    presentPopup = true
                                }
                            } label : {
                                Text("초대")
                                    .foregroundStyle(.red)
                                    .font(.callout)
                            }
                        }
                    }
                }
                .buttonStyle(PlainButtonStyle())
//                .selectionDisabled(true)
                .listStyle(.plain)
                .navigationTitle("멤버검색")
                .searchable(text: $searchText, prompt: "이메일을 입력하세요")
                .alert(alertMsg ?? "잠시 후 다시 시도해 주세요", isPresented: $alert) {
                    
                }
                if presentPopup {
                    Color.black.opacity(0.5)
                        .edgesIgnoringSafeArea(.all)
                        .onTapGesture {
                            // 이거 주석풀면 에러남
                            withAnimation(.spring()) {
                                presentPopup = false
                            }
                        }
                    TextInputPopup(inputTitle: "초대 메시지") { isClose, msg in
                        presentPopup = false
                        if isClose == false { // 초대버튼 눌렀음
                            inviteMember(recvUserKey: recvUserKey, msg: msg)
                        }
                    }
                    .padding()
                    .transition(.opacity)
                    .animation(.default, value: presentPopup)
                        
                }
            }
            .alert(viewModel.errMsg ?? "잠시 후 다시 시도해 주세요", isPresented: $viewModel.alert) {
            }
        }
        .onSubmit(of: .search) {    // 키보드 검색 버튼 이벤트
            viewModel.memberSearch(email: searchText)
        }
        .onChange(of: viewModel.memberSearchResult) {
            if let list = viewModel.memberSearchResult?.data {
                items = list
            }
        }
        .onChange(of: viewModel.sendInviteResult) {
            if viewModel.sendInviteResult?.result == 1 {
                
            }
        }
        
    }
    
    func inviteMember(recvUserKey: Int, msg: String) {
        print("invite receive user key : \(recvUserKey) \(userKey ?? -100)")
        if let userKey = userKey, let album = album {
            viewModel.memberInvite(albumKey: album.albumkey, sendUserKey: userKey, recvUserKey: recvUserKey, msg: msg)
        }
    }
    
}


#Preview {
    let album = Album(albumkey: "1afa7816-1408-4919-acf1-15a15cb71273",
                            title: "그냥 만든 앨범",
                            members: "3",
                            owner: 3,
                            enable: 1)
    MemberSearchView(album: album)
}

//
//  MembersView.swift
//  Album
//
//  Created by shbaek on 8/1/25.
//
import SwiftUI


struct MembersView: View {
    @AppStorage("userkey") var userKey: Int?
    
    @StateObject var viewModel = MembersViewModel()
    @State var album: Album?
    
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationStack {
            VStack {
                List {
                    ForEach(viewModel.members ?? []) { member in
                        HStack {
                            Text(member.nick)
                            Spacer()
                            Text(memberLevelText(userKey: member.userkey))
                                .foregroundStyle(.red)
                        }
                        .listRowBackground(Color.black.opacity(0.1))
                        
                    }
                }
                .scrollContentBackground(.hidden)
                // 내가 주인인지 확인하고 주인이면 초대
                if let userKey = userKey, album?.owner == userKey {
                    
                    NavigationLink {
                        //                    MemberInviteView()
                        if let album = album {
                            MemberSearchView(album: album)
                        }
                    } label: {
                        Text("멤버 초대")
                            .font(.headline)
                            .foregroundColor(.red)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .cornerRadius(10)
                    }
                    .padding()
                    .overlay {
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color.red, lineWidth: 1)
                            .padding()
                    }
                } else { // 탈퇴
                    Button {
                        
                    } label: {
                        Text("앨범 떠나기")
                            .font(.headline)
                            .foregroundColor(.red)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .cornerRadius(10)
                    }
                    .padding()
                    .overlay {
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color.red, lineWidth: 1)
                            .padding()
                    }
                    
                }
                
            }
            .navigationTitle("멤버")
            .toolbar { // 내비게이션 버튼
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark")
                    }
                }
//                ToolbarItem(placement: .topBarLeading) {
//                    Button {
//                        
//                    } label: {
//                        Text("초대")
//                    }
//                }
            }
        }
        .onAppear {
            if let album = album {
                viewModel.memberList(userKeyString: album.members)
            }
        }
    }
    
    func memberLevelText(userKey: Int) -> String {
        if let album = album {
            return album.owner == userKey ? "Owner" : "Member"
        } else {
            return "Member"
        }
    }
    
}


#Preview {
    let album = Album(albumkey: "1afa7816-1408-4919-acf1-15a15cb71273",
                      title: "그냥 만든 앨범",
                      members: "3",
                      owner: 3,
                      enable: 1)
    MembersView(album: album)
}

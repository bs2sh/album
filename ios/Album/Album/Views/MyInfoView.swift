//
//  MyInfoView.swift
//  Album
//
//  Created by shbaek on 8/16/25.
//

import SwiftUI

struct MyInfoView: View {
    @AppStorage("userkey") var userkey: Int?
    @EnvironmentObject var userViewModel: UserViewModel
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        VStack {
            // 프로필 이미지
            Image(systemName: "person.circle.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundColor(.gray)
                .padding(.bottom, 10)
            
            // 닉네임
            if let myInfo = userViewModel.user {
                Text(myInfo.nick)
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                    .padding(EdgeInsets(top: 10, leading: 5, bottom: 5, trailing: 0))
                Text(myInfo.email)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .padding(.bottom, 10)
            }
            Spacer()
            
            List {
                Text("이용약관")
                Text("개인정보 처리방침")
            }
            
            Spacer()
            // 로그아웃 버튼
            Button {
                userViewModel.removeUsrInfo()
                dismiss()
            } label: {
                Text("로그아웃")
                    .foregroundStyle(.red)
            }
            .buttonStyle(.plain)
            
        }
    }
}

#Preview {
    MyInfoView()
        .environmentObject(UserViewModel())
}

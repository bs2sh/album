//
//  ProfileView.swift
//  Album
//
//  Created by shbaek on 9/10/25.
//

import SwiftUI

struct UserProfileView: View {
    let nickname: String
    let email: String
    
    var body: some View {
        VStack(spacing: 20) {
            
            // 프로필 이미지 영역
            VStack {
                // 프로필 이미지가 없는 경우를 위한 Placeholder
                Image(systemName: "person.circle.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100, height: 100)
                    .foregroundColor(.gray)
                    .padding(.bottom, 10)
                
                Text(nickname)
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                
                Text(email)
                    .font(.body)
                    .foregroundColor(.secondary)
            }
            .padding(.top, 40)
            
            // 정보 섹션 (옵션)
            VStack(alignment: .leading, spacing: 15) {
                HStack {
                    Image(systemName: "envelope.fill")
                        .foregroundColor(.accentColor)
                    Text("이메일 주소")
                    Spacer()
                    Text(email)
                        .foregroundColor(.secondary)
                }
                Divider()
                HStack {
                    Image(systemName: "person.text.rectangle.fill")
                        .foregroundColor(.accentColor)
                    Text("닉네임")
                    Spacer()
                    Text(nickname)
                        .foregroundColor(.secondary)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(15)
            .padding(.horizontal)
            
            Spacer()
            
            // 로그아웃 버튼
            Button(action: {
                // 로그아웃 로직 구현
                print("로그아웃 버튼 탭됨")
            }) {
                Text("로그아웃")
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .cornerRadius(10)
            }
            .padding(.horizontal)
            .padding(.bottom, 20)
        }
    }
}

// 미리보기
#Preview {
    UserProfileView(nickname: "Test닉네임", email: "test@aaa.com")
}

//
//  JoinView.swift
//  Album
//
//  Created by shbaek on 6/19/25.
//
import SwiftUI


struct JoinView: View {
    
    @StateObject private var viewModel = JoinViewModel()
    @State private var email: String = ""
    @State private var pw: String = ""
    @State private var pwCheck: String = ""
    @State private var nick: String = ""
    
    @Environment(\.dismiss) var dismiss

    // 비밀번호 일치 여부
    var passwordsMatch: Bool {
        pw == pwCheck && !pw.isEmpty
    }

    var errorMsg: String {
        if passwordsMatch {
            ""
        } else if (pw.isEmpty == false){
            "비밀번호가 일치하지 않습니다."
        } else {
            ""
        }
    }
    
    var borderColor: Color {
        if pw.isEmpty && pwCheck.isEmpty {
            .white
        } else if passwordsMatch {
            .green
        } else {
            .red
        }
    }
    
    var body: some View {
        VStack {
            // 닫기버튼 여기 있음.
            HStack {
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                }
                .padding()
                .tint(.white)
            }
            
            Spacer()
            
            Text("사용자 등록")
                .font(Font.system(size: 50, weight: .regular))
                .foregroundStyle(.white)
                .padding()
            
            Spacer()
            
            VStack {
                
                CustomTextField(placeholder: "이메일", text: $email, isSecure: false, borderColor: .white)
                    .padding(.vertical, 15)
                    .keyboardType(.emailAddress)
                
                CustomTextField(placeholder: "닉네임", text: $nick, borderColor: .white)
                
                
                CustomTextField(placeholder: "비밀번호", text: $pw, isSecure: true, borderColor: borderColor)
                    .padding(.vertical, 15)
                
                CustomTextField(placeholder: "비밀번호 확인", text: $pwCheck, isSecure: true, borderColor: borderColor)
                
                Text(errorMsg)
                    .font(.caption)
                    .foregroundColor(.red)
                
                Button {
                    //                dismiss()
                    print("\(email), \(pw), \(nick)")
                    viewModel.joinUser(email: email, pw: pw, nick: nick)
                } label: {
                    Text("가입")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(.white)
                }
                
                .frame(maxWidth: .infinity, maxHeight: 50)
                .overlay(content: {
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.white, lineWidth: 3)
                })
                .padding(.top, 20)
                .alert(viewModel.userJoin?.msg ?? "오류", isPresented: $viewModel.alert) {
                    Button("확인", role: .cancel) { }
                }
            }
            .padding()
            
            Spacer()
        }
        .background(
            Image("bg")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()
        )
        .alert("등록 되었습니다.", isPresented: $viewModel.alert) {
            Button("확인", role: .destructive) {
                dismiss()
            }
        }
    }
        
}

#Preview {
    JoinView()
}

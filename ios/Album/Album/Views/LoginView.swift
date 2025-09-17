//
//  LoginView.swift
//  Album
//
//  Created by shbaek on 6/19/25.
//
import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()
    @State private var presentJoin: Bool = false
    
    @State private var email: String = ""
    @State private var password: String = ""
    
    @State var loginAlert: Bool = false
    
    @AppStorage("userkey") var userKey: Int?
    @EnvironmentObject var userViewModel: UserViewModel
    
    var body: some View {
        VStack {
            Spacer()
            VStack {
                Image("home")
                    .resizable()
                    .scaledToFit()
                    .padding(.horizontal, 40)
            }
            
            Spacer()
            
            HStack {
                VStack {
                    TextField("Email", text: $email)
                        .textFieldStyle(.roundedBorder)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .background(
                            Color.white.opacity(0.5)
                        )
                    
                    SecureField("Password", text: $password)
                        .textFieldStyle(.roundedBorder)
                        .padding(.top, 8)
                }
                
                Button(action: {
                    viewModel.login(email: email, pw: password)
                }) {
                    Text("로그인")
                        .font(.headline.bold())
                        .foregroundColor(.white)
                        .padding()
                    
                }
                .cornerRadius(10)
                .padding()
                .overlay(content: {
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.white, lineWidth: 3)
                })
                
                .alert(viewModel.userlogin?.msg ?? "로그인 실패",
                       isPresented: $viewModel.loginFail) {
                }
                
            }
            
            Button(action: {
                presentJoin.toggle()
            }) {
                Text("사용자 등록")
                    .font(.system(size: 18))
                    .foregroundStyle(.white)
            }
            .padding()
            
            
            
        }
        .padding(EdgeInsets(top: 10, leading: 10, bottom: 20, trailing: 10))
        .background(
            Image("bg")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()
        )
        .sheet(isPresented: $presentJoin) {
            
        } content: {
            JoinView()
        }
        .onChange(of: viewModel.userlogin) {
            if let userlogin = viewModel.userlogin {
                if userlogin.userKey > 0 {
                    
                    userKey = userlogin.userKey
                    userViewModel.fetchUserInfo(userKey: userlogin.userKey)
                    print("로그인 성공 : \(userKey) / \(viewModel.userlogin?.userKey)")
                }
            }
        }
    }
}

#Preview {
    LoginView()
}



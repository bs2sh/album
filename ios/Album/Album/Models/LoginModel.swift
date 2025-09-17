//
//  LoginModel.swift
//  Album
//
//  Created by shbaek on 6/19/25.
//
import Foundation
import Combine

struct UserLogin: Codable, Equatable {
    let result: Int
    let msg: String
    let userKey: Int
    let nick: String
}

class LoginViewModel: ObservableObject {
    @Published var userlogin: UserLogin?
    @Published var loginFail: Bool = false
    
    var cancellables = Set<AnyCancellable>()
    
    func login(email: String, pw: String) {
        print("LoginViewModel login() called. \(email), \(pw)")
        APIService.login(email: email, pw: pw)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                    case .failure(let err) :
                        print("err: \(err)")
                        self?.userlogin = UserLogin(result: 0, msg: err.localizedDescription, userKey: -1, nick: "")
                        self?.loginFail = true
                    case .finished : break
                }
                
            } receiveValue: { [weak self] login in
                self?.userlogin = login
                self?.loginFail = login.result == 0 ? true : false
//                print("LoginViewModel login result: \(self?.userlogin)")
            }
            .store(in: &cancellables)
    }
}

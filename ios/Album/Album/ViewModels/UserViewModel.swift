//
//  UserViewModel.swift
//  Album
//
//  Created by shbaek on 7/17/25.
//

import Foundation
import Combine

class UserViewModel: ObservableObject {
//    @Published var userInfo: UserInfo?
    @Published var user: User? = User(userKey: 0, email: "test@aaa.com", nick: "Test닉네임", albums: "")
    
    var cancellables: Set<AnyCancellable> = []
    
    func fetchUserInfo(userKey: Int) {
        APIService.userInfo(userKey: userKey)
            .receive(on: DispatchQueue.main)
            .print()
            .sink { completion in
                
            } receiveValue: { [weak self] userInfo in
                print("userinfo: \(userInfo)")
                self?.user = userInfo.data
                
            }
            .store(in: &cancellables)
    }
    
    func removeUsrInfo() {
        self.user = nil
        Shared.shared.setUserKey(nil)
    }
    
    
}

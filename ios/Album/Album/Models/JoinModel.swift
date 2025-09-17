//
//  JoinModel.swift
//  Album
//
//  Created by shbaek on 6/24/25.
//
import Combine
import Foundation

struct UserJoin: Codable {
    var result: Int
    var msg: String
}

class JoinViewModel: ObservableObject {
    @Published var userJoin: UserJoin?
    @Published var alert: Bool = false
    
    var cancellables = Set<AnyCancellable>()
    
    func joinUser(email: String, pw: String, nick: String) {
        
        APIService.join(email: email, pw: pw, nick: nick)
            .receive(on: DispatchQueue.main)
            .sink { /*[weak self]*/ completion in
                switch completion {
                    case .failure(let error):
                        print("error: \(error)")
                    case .finished:
                        break
                }
            } receiveValue: { [weak self] userJoin in
                print(userJoin)
                self?.userJoin = userJoin
                self?.alert = userJoin.result == 0 ? true : false
            }
            .store(in: &cancellables)
    }

}

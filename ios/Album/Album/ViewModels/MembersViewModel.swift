//
//  MembersViewModel.swift
//  Album
//
//  Created by shbaek on 8/4/25.
//

import Foundation
import Combine

class MembersViewModel: ObservableObject {
    @Published var result: MembersModel?
    @Published var members: [Member]?
    
    @Published var errMsg: String?
    @Published var alert: Bool = false
    
    var cancellables: Set<AnyCancellable> = []
    
    func memberList(userKeyString: String) {
        APIService.memberList(userKeyString: userKeyString)
            .receive(on: DispatchQueue.main)
            .print("MembersViewModel >>")
            .sink { [weak self] completion in
                switch completion {
                    case .failure(let error):
                        self?.errMsg = error.localizedDescription
                        self?.alert.toggle()
                    case .finished:
                        print("MembersViewModel >> finished")
                        break
                }
            } receiveValue: { [weak self] result in
                self?.result = result
                self?.members = result.data
            }
            .store(in: &cancellables)
    }
    
    
}

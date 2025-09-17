//
//  MemberSearchViewModel.swift
//  Album
//
//  Created by shbaek on 8/7/25.
//

import Foundation
import Combine

class MemberSearchViewModel: ObservableObject {
//    @Published var searchText: String = ""
    @Published var memberSearchResult: MemberSearchModel?
    @Published var searchedMembers: [User]?
    
    @Published var sendInviteResult: SendInviteModel?
    
    @Published var errMsg: String?
    @Published var alert: Bool = false
    
    private var cancellables: Set<AnyCancellable> = []

    // 사용자 검색
    func memberSearch(email: String) {
        APIService.memberSearch(email: email)
            .receive(on: DispatchQueue.main)
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
                self?.memberSearchResult = result
                if result.result == 0 {
                    self?.alert = true
                    self?.errMsg = result.msg
                }
                self?.searchedMembers = result.data
            }
            .store(in: &cancellables)
    }
    
    // 초대 보내기
    func memberInvite(albumKey: String, sendUserKey: Int, recvUserKey: Int, msg: String) {
        let param: [String: Any] = [
            "albumKey": albumKey,
            "sendUserKey": sendUserKey,
            "recvUserKey": recvUserKey,
            "msg" : msg
        ]
        APIService.fetchData(url: API.inviteMember.url , param: param, type: SendInviteModel.self)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                    case .failure(let error):
                        self?.errMsg = error.localizedDescription
                        self?.alert.toggle()
                    case .finished:
                        print("MembersViewModel 2222 >> finished")
                        break
                }
            } receiveValue: { [weak self] result in
                self?.sendInviteResult = result
                if result.result == 0 {
                    self?.alert = true
                    self?.errMsg = result.msg
                }
            }
            .store(in: &cancellables)
    }
    
}

//
//  InviteListViewModel.swift
//  Album
//
//  Created by shbaek on 8/19/25.
//
import Foundation
import Combine

class InviteListViewModel: ObservableObject {
    @Published var sendInviteList: [SendInvite] = [
        SendInvite(inviteKey: 1, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 6),
        SendInvite(inviteKey: 2, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 6),
        SendInvite(inviteKey: 3, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 0),
        SendInvite(inviteKey: 4, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 0),
        SendInvite(inviteKey: 5, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 0),
        SendInvite(inviteKey: 6, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 1),
        SendInvite(inviteKey: 7, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 0),
        SendInvite(inviteKey: 8, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 0),
        SendInvite(inviteKey: 9, albumKey: "34f40040-61ea-4e64-", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 0),
        SendInvite(inviteKey: 10, albumKey: "34f40040-61ea-4e64", albumTitle: "앨범범", recvUserKey: 1, recvUserNick: "nickkkkkka", state: 0)
    ]
    @Published var receiveInviteList: [ReceiveInvite] = [
        ReceiveInvite(inviteKey: 1, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 6),
        ReceiveInvite(inviteKey: 2, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 6),
        ReceiveInvite(inviteKey: 3, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 0),
        ReceiveInvite(inviteKey: 4, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 0),
        ReceiveInvite(inviteKey: 5, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 0),
        ReceiveInvite(inviteKey: 6, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 1),
        ReceiveInvite(inviteKey: 7, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 0),
        ReceiveInvite(inviteKey: 8, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 0),
        ReceiveInvite(inviteKey: 9, albumKey: "34f40040-61ea-4e64-8b62", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 0),
        ReceiveInvite(inviteKey: 10, albumKey: "34f40040-61ea-4e64-8b68", albumTitle: "앨범범", sendUserKey: 1, sendUserNick: "nickkkkkka", state: 0)
    ]
    var cancellables: [AnyCancellable] = []
    @Published var alert: Bool = false
    var errMsg: String?
    @Published var stateUpdated = 0
    
    func fetchSendInvite(sendUserKey: Int) {
        let param = [
            "sendUserKey": sendUserKey
        ]
        APIService.fetchData(url: API.sendInviteList.url, param: param, type: SendInviteModel.self)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                    case .failure(let error):
                        print("error: \(error)")
                        self?.alert = true
                        self?.errMsg = error.localizedDescription
                    default:
                        break
                }
            } receiveValue: { [weak self] value in
                if let data = value.data {
                    self?.sendInviteList = data
                    if data.isEmpty {
                        self?.alert = true
                        self?.errMsg = "보낸 초대가 없습니다."
                    }
                }
            }
            .store(in: &cancellables)
    }
    
    func fetchInviteList(userKey: Int) {
        APIService.fetchInviteData(userKey: userKey)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                    case .failure(let error):
                        print("error: \(error)")
                        self?.alert = true
                        self?.errMsg = error.localizedDescription
                    default:
                        break
                }
            } receiveValue: { [weak self] sendInvite, receiveInvite in
                if sendInvite.result == 0 {
                    self?.alert = true
                    self?.errMsg = sendInvite.msg
                } else if (receiveInvite.result == 0) {
                    self?.alert = true
                    self?.errMsg = receiveInvite.msg
                } else {
                    if let list1 = sendInvite.data, let list2 = receiveInvite.data {
                        self?.sendInviteList = list1
                        self?.receiveInviteList = list2
                    }
                }
            }
            .store(in: &cancellables)
        
    }
    
    func updateInviteState(inviteKey: Int, accept: Int) {
        if !(accept == 1 || accept == 2) {
            return
        }
        
        let param = [
            "inviteKey": inviteKey,
            "state": accept
        ]
        
        APIService.fetchData(url: API.updateInvite.url, param: param, type: UpdateInviteModel.self)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                self?.updateErrorState(completion: completion)
            } receiveValue: { [weak self] value in
                if value.result == 0 {
                    self?.alert = true
                    self?.errMsg = value.msg
                } else {
                    self?.stateUpdated = accept
                }
            }
            .store(in: &cancellables)
    }
    
    func updateErrorState(completion: (Subscribers.Completion<any Error>)) {
        switch completion {
            case .failure(let error):
                print("error: \(error)")
                self.alert = true
                self.errMsg = error.localizedDescription
            default:
                break
        }
    }
    
    func updateResultState<T: Decodable & Equatable>(result: BaseResponse<T>) {
        if result.result == 0 {
            self.alert = true
            self.errMsg = result.msg
        }
    }
    
}

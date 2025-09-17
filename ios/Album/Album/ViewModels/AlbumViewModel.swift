//
//  AlbumViewModel.swift
//  Album
//
//  Created by shbaek on 9/17/25.
//

import Foundation
import Combine

class AlbumViewModel: ObservableObject {
    @Published var albumCreate: AlbumCreate?
    @Published var joinAlbums: JoinAlbums? = JoinAlbums(result: 1, msg: "", albums: [Album(albumkey: "197be471-4109-4602-8041-b3bdda77baf7", title: "The first time", members: "3", owner: 3, enable: 1), Album(albumkey: "f7cca0cc-125f-436e-80ec-4e8d8b8e10bc", title: "new my album", members: "3,2", owner: 3, enable: 1), Album(albumkey: "1afa7816-1408-4919-acf1-15a15cb71273", title: "그냥 만든 앨범", members: "3", owner: 3, enable: 1), Album(albumkey: "1a3c1242-7638-44fc-86fd-7f38d45fa400", title: "다시 만든 앨범", members: "3", owner: 3, enable: 1), Album(albumkey: "9bc6139a-c587-4048-9f10-75a696cc7faf", title: "Aaaa", members: "3", owner: 3, enable: 1)])
    
    @Published var showErrorAlert = false
    @Published var errorMsg: String?
    
    var cancellables: Set<AnyCancellable> = []
    
    
    func createAlbum(title: String, userkey: Int) {
        APIService.createAlbum(userkey: userkey, title: title)
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                
            }, receiveValue: { [weak self] albumCreate in
                self?.albumCreate = albumCreate
                print(self?.albumCreate ?? "nil")
            })
            .store(in: &cancellables)
    }
    
    func joinAlbums(userkey: Int) {
        print(">>> join call >>> \(userkey)")
        if (userkey < 0) {
            return
        }
        
        APIService.joinAlbums(user: userkey)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                    case .failure(let error):
                        print("API joinAlbums error: \(error)")
                        self?.showErrorAlert = true
                        self?.errorMsg = error.localizedDescription
                    case .finished:
                        print("API joinAlbums finished")
                }
            } receiveValue: { [weak self] joinAlbums in
                self?.joinAlbums = joinAlbums
//                print(self?.joinAlbums ?? "nil")
            }
            .store(in: &cancellables)
        
    }
    
}


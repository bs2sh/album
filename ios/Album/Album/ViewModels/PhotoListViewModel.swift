//
//  PhotoListViewModel.swift
//  Album
//
import UIKit
import Combine

class PhotoListViewModel: ObservableObject {
    // 사진 업로드 결과
    @Published var uploadResult: UploadPhoto?
    
    // 사진 리스트 결과
    @Published var photoListResult: PhotoListModel?
    @Published var photoList: [Photo] = []
    
    
    @Published var errMsg: String?
    @Published var uploadErrorAlert: Bool = false
    
    var cancellables: Set<AnyCancellable> = []
    
    func refreshPhotoList(userKey: Int, albumKey: String) {
        photoList(userKey: userKey, albumKey: albumKey, lastPhotoKey: "")
    }
    
    func uploadPhoto(userkey: Int, usernick: String, albumkey: String, photos: [(image: UIImage, description: String)]) {
        APIService.uploadPhoto(userkey: userkey, usernick: usernick, albumkey: albumkey, photos: photos)
            .receive(on: DispatchQueue.main)
            .print("PhotoViewModel >> ")
            .sink { [weak self] completion in
                switch completion {
                    case .failure(let error):
                        self?.errMsg = error.localizedDescription
                        self?.uploadErrorAlert.toggle()
                    case .finished:
                        break
                }
            } receiveValue: { [weak self] uploadResult in
                self?.uploadResult = uploadResult
            }
            .store(in: &cancellables)
    }
    
    func photoList(userKey: Int, albumKey: String, lastPhotoKey: String) {
    
        APIService.photoList(userKey: userKey, albumKey: albumKey, lastPhotoKey: lastPhotoKey)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                    case .failure(let error):
                        self?.errMsg = error.localizedDescription
                        self?.uploadErrorAlert.toggle()
                    case .finished:
                        break
                }
            } receiveValue: { [weak self] result in
                self?.photoListResult = result
                if let data = result.data {
                    if lastPhotoKey.isEmpty { // lastPhotoKey 가 없으면 첫번째 데이터 (paging 1) photoList 다 삭제.
                        self?.photoList.removeAll()
                    }
                    self?.photoList.append(contentsOf: data.list)
                }
            }
            .store(in: &cancellables)
    }
    
    
}


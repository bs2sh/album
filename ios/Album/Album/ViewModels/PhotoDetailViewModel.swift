//
//  PhotoDetailViewModel.swift
//  Album
//
//  Created by shbaek on 9/23/25.
//

import Foundation
import Combine

class PhotoDetailViewModel: ViewModel {
    var photoKey: String = ""
    
    @Published var commentList: [Comment] = []
    @Published var deletedCommentKey: Int = 0
    @Published var addedCommentKey: Int = 0
    
    
    func fetchCommentList(photoKey: String) {
        self.photoKey = photoKey
        APIService.fetchData(url: API.commentList.url, param: ["photoKey": photoKey], type: CommentListModel.self)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                self?.completion(completion: completion)
            } receiveValue: { [weak self] result in
                if result.result == 0 {
                    self?.alert = true
                    self?.alertMsg = result.msg
                } else {
                    if let list = result.data {
                        self?.commentList = list
                    }
                }
            }
            .store(in: &cancellables)
    }
    
    func addComment(userKey: Int, photoKey: String, comment: String) {
        let param: [String: Any] = ["userKey": userKey, "photoKey": photoKey, "comment": comment]
        APIService.fetchData(url: API.addComment.url, param: param, type: CommentAddModel.self)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                self?.completion(completion: completion)
            } receiveValue: { [weak self] result in
                guard let self = self else { return }
                
                if result.result == 0 {
                    self.alert = true
                    self.alertMsg = result.msg
                } else {
                    if let data = result.data {
                        if self.addedCommentKey != data.commentKey {
                            self.alert = true
                            self.alertMsg = "댓글이 등록되었습니다."
                            self.addedCommentKey = data.commentKey
                            self.fetchCommentList(photoKey: self.photoKey)
                        }
                    }
                }
            }
            .store(in: &cancellables)
    }
    
    func deleteComment(commentKey: Int) {
        let param: [String: Any] = ["commentKey": commentKey]
        APIService.fetchData(url: API.deleteComment.url, param: param, type: EmptyModel.self)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                self?.completion(completion: completion)
            } receiveValue: { [weak self] result in
                guard let self = self else { return }
                
                if result.result == 0 {
                    self.alert = true
                    self.alertMsg = result.msg
                } else {
                    self.deletedCommentKey = commentKey
                    self.fetchCommentList(photoKey: self.photoKey)
                }
            }
            .store(in: &cancellables)
    }
}

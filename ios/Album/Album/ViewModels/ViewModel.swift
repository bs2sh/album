//
//  ViewModel.swift
//  Album
//
//  Created by shbaek on 9/3/25.
//

import Foundation
import Combine

class ViewModel: ObservableObject {
    
    @Published var alert = false
    var alertMsg = ""
    internal var cancellables: Set<AnyCancellable> = []
    
    func completion(completion: (Subscribers.Completion<any Error>)) {
        switch completion {
            case .failure(let error):
                print("error: \(error)")
                self.alert = true
                self.alertMsg = error.localizedDescription
            default:
                break
        }
    }
    
    func updateResultState<T: Decodable & Equatable>(result: BaseResponse<T>) {
        if result.result == 0 {
            self.alert = true
            self.alertMsg = result.msg
        }
    }
}

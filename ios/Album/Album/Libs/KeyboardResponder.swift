//
//  KeyboardResponder.swift
//  Album
//
//  Created by shbaek on 9/30/25.
//

import SwiftUI
import Combine

class KeyboardResponder: ObservableObject {
    @Published var currentHeight: CGFloat = 0
    private var cancellable: AnyCancellable?
    
    init() {
        // 키보드가 나타날 때의 높이를 가져오는 Publisher
        let keyboardWillShow = NotificationCenter.default.publisher(for: UIResponder.keyboardWillShowNotification)
            .compactMap { $0.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue }
            .map { $0.cgRectValue.height }

        // 키보드가 사라질 때 높이를 0으로 설정하는 Publisher
        let keyboardWillHide = NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)
            .map { _ in CGFloat(0) }

        // 두 Publisher를 합쳐서 currentHeight 프로퍼티를 업데이트
        cancellable = Publishers.Merge(keyboardWillShow, keyboardWillHide)
            .subscribe(on: DispatchQueue.main) // UI 업데이트는 메인 스레드에서
            .assign(to: \.currentHeight, on: self)
    }
}

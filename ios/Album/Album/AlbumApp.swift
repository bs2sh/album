//
//  AlbumApp.swift
//  Album
//
//  Created by shbaek on 6/19/25.
//

import SwiftUI

@main
struct AlbumApp: App {
    @AppStorage("userkey") var userKey: Int?
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var userViewModel = UserViewModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(userViewModel)
                .onAppear {
                    UIApplication.shared.addTapGestureRecognizer()
                }
                
        }
        // 앱 실행 상태가 변경될 때 사용자 정보 한번씩 더 가져혼다.
        .onChange(of: scenePhase, initial: true) { oldValue, newValue in
            if newValue == .inactive, let userKey = userKey {
                print(">>>>>>>>>> ++++++++ userKey: \(userKey)")
                if userKey > 0 {
                    userViewModel.fetchUserInfo(userKey: userKey)
                }
            }
        }
        
    }
}

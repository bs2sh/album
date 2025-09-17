//
//  ContentView.swift
//  Album
//
//  Created by shbaek on 6/19/25.
//

import SwiftUI

struct ContentView: View {
    @AppStorage("userkey") var userKey: Int?
    @EnvironmentObject var userViewModel: UserViewModel
    
    
    var body: some View {
        NavigationView {
            if let userKey = userKey, userKey > 0 {
                AlbumListView()
            }
            else {
                LoginView()
            }
        }
        .onChange(of: userKey) {
            print("userkey : \(userKey ?? -1)   😎 😎 😎")
        }
    }
}

#Preview {
    ContentView()
}

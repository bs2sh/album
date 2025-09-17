//
//  CreateAlbumView.swift
//  Album
//
//  Created by shbaek on 7/8/25.
//

import SwiftUI

struct CreateAlbumView: View {
    @AppStorage("userkey") var userkey: Int?
    @StateObject private var viewModel = AlbumViewModel()
    
    @State private var albumTitle: String = ""
    @State private var showError: Bool = false
    
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        VStack {
            
            Spacer()
            Text("앨범 만들기")
                .font(.system(size: 50, weight: .regular))
                .foregroundStyle(.white)
                .padding()
            
            Spacer()
            TextField("", text: $albumTitle, prompt:
                        Text("생성할 앨범 이름을 입력하세요.")
                .foregroundStyle(.white)
            )
                .frame(height: 30)
                .padding()
                .overlay {
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(.white, lineWidth: 2)
                }
                .padding()
            
            Spacer()
            
            Button {
                self.createAlbum(title: albumTitle)
                
            } label: {
                Text("만들기")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(.white)
            }
            .frame(maxWidth: .infinity, maxHeight: 50)
            .overlay(content: {
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.white, lineWidth: 3)
            })
            .padding()
            
            .onChange(of: viewModel.albumCreate) {
                print(#function)
                if viewModel.albumCreate?.result == 1 {
                    dismiss()
                } else {
                    showError.toggle()
                }
            }
            .alert(viewModel.albumCreate?.msg ?? "1", isPresented: $showError) {

            }
        }
        .backgroundImage(imageName: "bg")

    }
    
    // 앨범 생성 API 호출
    func createAlbum(title: String) {
        if let userkey = userkey {
            viewModel.createAlbum(title: title, userkey: userkey)
        }
    }
    
}

#Preview {
    CreateAlbumView()
}

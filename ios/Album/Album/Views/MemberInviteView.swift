//
//  MemberInviteView.swift
//  Album
//
//  Created by shbaek on 8/6/25.
//

import SwiftUI


struct MemberInviteView: View {
    var body: some View {
            NavigationStack {
                VStack {
                    
                    List {
                        ForEach(0..<10) { i in
                            //                            .foregroundStyle(.black)
                            NavigationLink("리스트\(i)") {
                                
                            }
                        }
                        
                    }
                    .scrollContentBackground(.hidden) // 이 한 줄로 배경이 사라집니다.
                    .background(.clear) // 배경 투명 처리
                    
                }
                .background(
                    Image("bg")
                        .resizable()
                        .scaledToFill()
                        .ignoresSafeArea()
                )
                .navigationTitle("aaaaa")
                .background(.clear)
//                .frame(width: 200, height: 300)
            
            
            
//            Text("이미지")
        }
    }
}

#Preview {
    MemberInviteView()
}

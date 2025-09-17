//
//  TextInputPopup.swift
//  Album
//
//  Created by shbaek on 8/13/25.
//

import SwiftUI

struct TextInputPopup: View {
    @State var inputTitle: String = ""
    @State var inviteMsg: String = ""
    
    var onClose: ((Bool, String) -> Void)?
    
    var body: some View {
        VStack {
            HStack(alignment: .center) {
                
                ZStack {
//                    Text(inputTitle)
//                        .frame(height: 30)
//                        .font(.title2)
                    HStack(alignment: .center) {
                        Spacer()
                        Button {
                            onClose?(false, "")
                        } label: {
                            Image(systemName: "xmark")
                                .tint(.white)
                        }
                        .padding(.all, 5)
                    }
                }
            }
            TextField("", text: $inviteMsg, prompt: Text("초대 메시지를 입력하세요").foregroundStyle(.white))
                .padding()
                .frame(maxHeight: .infinity)
                .font(.title3)
                .background(Color.white.opacity(0.2))
                .lineLimit(10, reservesSpace: true)
                .clipShape(RoundedRectangle(cornerRadius: 10))
            Button {
                onClose?(true, inviteMsg)
            } label: {
                Text("초대")
                    .font(.system(size: 20).bold())
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .cornerRadius(10)
            }
            .overlay {
                RoundedRectangle(cornerRadius: 5)
                    .stroke(Color.white.opacity(0.3), lineWidth: 3)
            }
        }
        .padding()
        .frame(width: 320, height: 320)
        .background(
            Color.black.opacity(0.4)
        )
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

#Preview {
    TextInputPopup(inputTitle: "제목")
}

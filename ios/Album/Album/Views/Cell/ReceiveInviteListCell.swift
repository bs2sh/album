//
//  ReceiveInviteListCell.swift
//  Album
//
//  Created by shbaek on 8/22/25.
//

import SwiftUI

struct ReceiveInviteListCell: View {
    var receiveInvite: ReceiveInvite? = ReceiveInvite(inviteKey: 0, albumKey: "a", albumTitle: "우리 가족 앨범", sendUserKey: 1, sendUserNick: "막내딸", state: 0)
    var acceptInvite: ((Int) -> Void)?
    
    var body: some View {
        VStack(alignment: .leading) {
            if let invite = receiveInvite {
                let _ = print("receive invite : \(invite)\n")
                Text("\(invite.sendUserNick)님이 \(invite.albumTitle)(으)로 초대했어요")
                    .font(.title3)
                    .lineLimit(2)
                    .padding(.bottom, 5)
                if invite.state == 0 {
                    HStack {
                        Spacer()
                        Button {
                            acceptInvite?(2)
                        } label: {
                            Text("거절")
                                .padding(5)
                                .foregroundStyle(.white)
                        }
                        .background(.red)
                        .padding(.trailing, 10)
                        
                        Button {
                            acceptInvite?(1)
                        } label: {
                            Text("수락")
                                .padding(5)
                                .foregroundStyle(.white)
                        }
                        .background(.blue)
                        .padding(.trailing, 10)
                    }
                    
                } else if invite.state == 1 {
                    Text("초대를 수락했어요")
                } else {
                    Text("초대를 거절했어요")
                }
            } else {
                Text("초대 정보가 올바르지 않습니다")
            }
            
        }
        .frame(maxWidth: .infinity, maxHeight: 110, alignment: .leading)
    }
}

#Preview {
    ReceiveInviteListCell()
}

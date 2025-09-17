//
//  InviteListCell.swift
//  Album
//
//  Created by shbaek on 8/22/25.
//
import SwiftUI

struct SendInviteListCell: View {
    var sendInvite: SendInvite?
    var body: some View {
        VStack(alignment: .leading) {
            if let invite = sendInvite {
                Text("\(invite.recvUserNick)님을 \(invite.albumTitle)(으)로 초대했어요")
                    .font(.system(size: 20))
                    .lineLimit(2)
                    .padding(.bottom, 5)
                    
                if invite.state == 0 {
                    Text("\(invite.recvUserNick) 님이 수락을 고민하고 있어요")
                        .font(.system(size: 17))
                } else if invite.state == 1 {
                    Text("\(invite.recvUserNick) 님이 수락했어요")
                        .font(.system(size: 17))
                } else {
                    Text("\(invite.recvUserNick) 님이 거절했어요")
                        .font(.system(size: 17))
                }
            } else {
                Text("초대 정보가 올바르지 않습니다")
            }
        }
        .frame(maxWidth: .infinity, maxHeight: 80, alignment: .leading)
    }
}

#Preview {
    let invite = SendInvite(inviteKey: 0, albumKey: "0", albumTitle: "앨범타이틀", recvUserKey: 0, recvUserNick: "받는사람", state: 1)
    SendInviteListCell(sendInvite: invite)
}



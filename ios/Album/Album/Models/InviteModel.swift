//
//  InviteModel.swift
//  Album
//
//  Created by shbaek on 8/13/25.
//

import Foundation

typealias SendInviteModel = BaseResponse<[SendInvite]>
typealias ReceiveInviteModel = BaseResponse<[ReceiveInvite]>
typealias UpdateInviteModel = BaseResponse<UpdateInvite>

struct SendInvite: Codable, Identifiable, Equatable {
    var id: Int { inviteKey }
    var inviteKey: Int
    var albumKey: String
    var albumTitle: String
    var recvUserKey: Int
    var recvUserNick: String
    var state: Int
}

struct ReceiveInvite: Codable, Identifiable, Equatable {
    var id: Int { inviteKey }
    var inviteKey: Int
    var albumKey: String
    var albumTitle: String
    var sendUserKey: Int
    var sendUserNick: String
    var state: Int
}

struct UpdateInvite: Codable, Equatable {
//    var inviteKey: Int
//    var state: Int
}

//
//  MembersModel.swift
//  Album
//
//  Created by shbaek on 8/4/25.
//

import Foundation

typealias MembersModel = BaseResponse<[Member]>

struct Member: Codable, Identifiable, Equatable {
    var id: Int { userkey }
    let userkey: Int
    let nick: String
    let email: String
    
//    enum codingKeys: String, CodingKey {
//        case userKey = "user_key"
//        case nick, email
//    }
}

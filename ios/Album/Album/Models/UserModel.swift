//
//  UserModel.swift
//  Album
//
//  Created by shbaek on 7/17/25.
//

import Foundation

typealias UserInfo = BaseResponse<User>
typealias MemberSearchModel = BaseResponse<[User]>

struct User: Codable, Equatable, Identifiable {
    var id: Int { userKey }
    let userKey: Int
    let email: String
    let nick: String
    let albums: String
}

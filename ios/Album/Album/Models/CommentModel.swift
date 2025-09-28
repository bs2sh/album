//
//  CommentModel.swift
//  Album
//
//  Created by shbaek on 9/23/25.
//

import Foundation

typealias CommentListModel = BaseResponse<[Comment]>
typealias CommentAddModel = BaseResponse<CommentAdd>
typealias CommentDeleteModel = BaseResponse<EmptyModel>

struct Comment: Codable, Identifiable, Equatable, Hashable {
    var id: Int { commentKey }
    let commentKey: Int
    let ownerKey: Int
    let ownerNick: String
    let comment: String
    let regdt: Double
}

struct CommentAdd: Codable, Equatable {
    var commentKey: Int
}

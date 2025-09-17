//
//  MyInfoModel.swift
//  Album
//
//  Created by shbaek on 8/28/25.
//
import Foundation
typealias MyInfoModel = BaseResponse<MyInfo>

struct MyInfo: Codable, Equatable {
    var name: String
    var email: String
    var albums: [Album]
}

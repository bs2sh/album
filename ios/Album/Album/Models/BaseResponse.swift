//
//  BaseResponse.swift
//  Album
//
//  Created by shbaek on 7/17/25.
//

import Foundation

struct BaseResponse<T: Decodable & Equatable>: Decodable, Equatable{
    let result: Int
    let msg: String
    var data: T?
}


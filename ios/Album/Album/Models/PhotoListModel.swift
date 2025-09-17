//
//  PhotoListModel.swift
//  Album
//
//  Created by shbaek on 7/23/25.
//

import Foundation

typealias PhotoListModel = BaseResponse<PhotoList>

struct UploadPhoto: Codable, Equatable {
    let result: Int
    let msg: String
    let paths: [String]
}

// MARK: - PhotoList
struct PhotoList: Codable, Equatable {
    let count: Int
    let list: [Photo]
}

// MARK: - Photo
struct Photo: Codable, Identifiable, Equatable {
    var id: String { photokey }
    let photokey, photopath: String
    let owner: Int
    let ownernick, albumkey: String
    let regdt: Int
    
    enum CodingKeys: String, CodingKey {
        case photokey = "photo_key"
        case photopath = "photo_path"
        case ownernick = "owner_nick"
        case albumkey = "album_key"
        case owner, regdt
    }
    
}

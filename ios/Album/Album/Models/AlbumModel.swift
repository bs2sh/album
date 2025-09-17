//
//  AlbumModel.swift
//  Album
//
//  Created by shbaek on 7/9/25.
//
import Foundation
import Combine

struct AlbumCreate: Codable, Equatable {
    let result: Int
    let msg: String
    let albumKey: String
}

// MARK: - JoinAlbums 내가 가입한 앨범 리스트
struct JoinAlbums: Codable {
    let result: Int
    let msg: String
    let albums: [Album]
    
}

// MARK: Album
struct Album: Codable, Identifiable, Equatable {
    var id: String { albumkey }
    let albumkey, title, members: String
    let owner, enable: Int
    
    enum CodingKeys: String, CodingKey {
        case albumkey = "album_key"
        case title, members, owner, enable
    }
    
}

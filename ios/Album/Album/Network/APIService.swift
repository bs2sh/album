//
//  API.swift
//  Album
//
//  Created by shbaek on 6/19/25.
//
import Foundation
import UIKit
import Combine

let server_url = "http://localhost:3100"

enum UserError: Error {
    case invalidParameters
}

enum API: String {
    case join
    case login
    case createAlbum
    case joinAlbums
    case photoUpload
    case userInfo
    case photoList
    case memberList
    case userSearch
    case inviteMember
    case sendInviteList
    case receiveInviteList
    case updateInvite
    case addComment
    case deleteComment
    case commentList
    
    
    var url: URL {
        switch self {
            case .join:
                return URL(string: server_url + "/user/join")!
            case .login:
                return URL(string: server_url + "/user/login")!
            case .createAlbum:
                return URL(string: server_url + "/album/create")!
            case .joinAlbums:
                return URL(string: server_url + "/user/joinalbums")!
            case .photoUpload:
                return URL(string: server_url + "/photo/upload")!
            case .userInfo:
                return URL(string: server_url + "/user/info")!
            case .photoList:
                return URL(string: server_url + "/photo/photolist")!
            case .memberList:
                return URL(string: server_url + "/user/infolist")!
            case .userSearch:
                return URL(string: server_url + "/user/search")!
            case .inviteMember:
                return URL(string: server_url + "/invite/sendInvite")!
            case .sendInviteList:
                return URL(string: server_url + "/invite/sendList")!
            case .receiveInviteList:
                return URL(string: server_url + "/invite/receiveList")!
            case .updateInvite:
                return URL(string: server_url + "/invite/update")!
            case .addComment:
                return URL(string: server_url + "/comment/addComment")!
            case .deleteComment:
                return URL(string: server_url + "/comment/deleteComment")!
            case .commentList:
                return URL(string: server_url + "/comment/commentList")!
        }
    }

}


class APIService {
    
    static func fetchData<T: Decodable>(url: URL, param: [String: Any], type: T.Type) -> AnyPublisher<T, Error> {
        // JSON 직렬화 에러 처리
        guard let bodyData = try? JSONSerialization.data(withJSONObject: param, options: []) else {
            return Fail(error: URLError(.cannotParseResponse))
                .eraseToAnyPublisher()
        }
        
        let request = APIService.request(url: url, method: "POST", body: bodyData)
        
        return URLSession.shared.dataTaskPublisher(for: request)
        // HTTP 상태코드 검증
            .tryMap { output -> Data in
                if let httpResponse = output.response as? HTTPURLResponse,
                   !(200...299).contains(httpResponse.statusCode) {
                    throw URLError(.badServerResponse)
                }
                return output.data
            }
            .decode(type: T.self, decoder: JSONDecoder())
            .print()
            .eraseToAnyPublisher()
    }
    
    
    /// 로그인
    /// - Parameters:
    ///   - email:
    ///   - pw:
    /// - Returns:
    static func login(email: String, pw: String) -> AnyPublisher<UserLogin, Error> {
        let params = [
            "email" : email,
            "pw" : pw
        ]
        
        let bodyData = try? JSONSerialization.data(withJSONObject: params, options: [])
        let request = APIService.request(url: API.login.url, method: "POST", body: bodyData)
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: UserLogin.self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
        
    }
    
    /// 회원가입
    /// - Parameters:
    ///   - email:
    ///   - pw:
    ///   - nick:
    /// - Returns:
    static func join(email: String, pw: String, nick: String) -> AnyPublisher<UserJoin, Error> {
        let params = [
            "email" : email,
            "pw" : pw,
            "nick" : nick
        ]

        let bodyData = try? JSONSerialization.data(withJSONObject: params, options: [])
        let request = request(url: API.join.url, method: "POST", body: bodyData)
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: UserJoin.self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
    }
    
    static func userInfo(userKey: Int) -> AnyPublisher<UserInfo, Error> {
        let params = [
            "userkey" : String(userKey)
        ]
            
        let bodyData = try? JSONSerialization.data(withJSONObject: params, options: [])
        let request = request(url: API.userInfo.url, method: "POST", body: bodyData)
        return URLSession.shared.dataTaskPublisher(for: request)
            .print()
            .map(\.data)
            .decode(type: UserInfo.self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
    }
    
    static func createAlbum(userkey: Int, title: String) -> AnyPublisher<AlbumCreate, Error> {
        let params = [
            "userKey" : String(userkey),
            "title" : title
        ]
        
        let bodyData = try? JSONSerialization.data(withJSONObject: params, options: [])
        let request = request(url: API.createAlbum.url, method: "POST", body: bodyData)
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: AlbumCreate.self, decoder: JSONDecoder())
            .print()
            .eraseToAnyPublisher()
    }
    
    static func joinAlbums(user: Int) -> AnyPublisher<JoinAlbums, Error> {
        let params = [
            "userkey" : String(user)
        ]
        
        let bodyData = try? JSONSerialization.data(withJSONObject: params, options: [])
        let request = request(url: API.joinAlbums.url, method: "POST", body: bodyData)
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: JoinAlbums.self, decoder: JSONDecoder())
            .print()
            .eraseToAnyPublisher()
    }
    
    static func uploadPhoto(userkey: Int, usernick: String, albumkey: String, images: [UIImage]) -> AnyPublisher<UploadPhoto, Error> {
        // 이미지 데이터부터 처리하자.
        
        print("image count : \(images.count)")
        
        let boundary = UUID().uuidString
        var request = URLRequest(url: API.photoUpload.url)
        request.httpMethod = "POST"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        // 이미지 배열 최대 5개만 전송
        for (i, image) in images.prefix(5).enumerated() {
            guard let imageData = image.jpegData(compressionQuality: 0.8) else { continue }
            print(">>> image data size : \(imageData.count)")
            let filename = "image\(i+1).jpg"
            let mimetype = "image/jpeg"
            body.append("\r\n--\(boundary)\r\n".data(using: .utf8)!)
            body.append("Content-Disposition: form-data; name=\"images\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
            body.append("Content-Type: \(mimetype)\r\n\r\n".data(using: .utf8)!)
            body.append(imageData)
            body.append("\r\n".data(using: .utf8)!)
        }
        
        // 추가 필드들
        let fields = [
            ("userkey", String(userkey)),
            ("usernick", usernick),
            ("albumkey", albumkey)
        ]
        for (key, value) in fields {
            body.append("--\(boundary)\r\n".data(using: .utf8)!)
            body.append("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n".data(using: .utf8)!)
            body.append(value.data(using: .utf8)!)
            body.append("\r\n".data(using: .utf8)!)
        }
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        
        request.httpBody = body
        
        return URLSession.shared.dataTaskPublisher(for: request)
            .print("Upload >>")
            .map(\.data)
            .decode(type: UploadPhoto.self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
    }
    
    static func photoList(userKey: Int, albumKey: String, lastPhotoKey: String) -> AnyPublisher<PhotoListModel, Error> {
        let params = [
            "userKey" : String(userKey),
            "albumKey" : albumKey,
            "lastPhotoKey" : lastPhotoKey
        ]
        
        let bodyData = try? JSONSerialization.data(withJSONObject: params, options: [])
        let request = request(url: API.photoList.url, method: "POST", body: bodyData)
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: PhotoListModel.self, decoder: JSONDecoder())
            .print()
            .eraseToAnyPublisher()
    }
    
    static func memberList(userKeyString: String) -> AnyPublisher<MembersModel, Error> {
        
        let param = ["userKeys": userKeyString]
        let bodyData = try? JSONSerialization.data(withJSONObject: param, options: [])
        let request = request(url: API.memberList.url, method: "POST", body: bodyData)
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: MembersModel.self, decoder: JSONDecoder())
            .print("iiii >>")
            .eraseToAnyPublisher()
    }
    
    static func memberSearch(email: String) -> AnyPublisher<MemberSearchModel, Error> {
        
        let param = ["email": email]
        let bodyData = try? JSONSerialization.data(withJSONObject: param, options: [])
        let request = request(url: API.userSearch.url, method: "POST", body: bodyData)
        return URLSession.shared.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: MemberSearchModel.self, decoder: JSONDecoder())
            .print("iiii >>")
            .eraseToAnyPublisher()
    }
 
    static func fetchInviteData(userKey: Int) -> AnyPublisher<(SendInviteModel, ReceiveInviteModel), Error> {
        let sendParam = [
            "sendUserKey": userKey
        ]
        let sendPublisher = APIService.fetchData(url: API.sendInviteList.url, param: sendParam, type: SendInviteModel.self)
        
        let recvParam = [
            "recvUserKey": userKey
        ]
        let recvPublisher = APIService.fetchData(url: API.receiveInviteList.url, param: recvParam, type: ReceiveInviteModel.self)
        
        return sendPublisher
            .zip(recvPublisher)
            .eraseToAnyPublisher()
    }
    
    
    fileprivate static func request(url: URL, method: String, body: Data?) -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = body
        request.timeoutInterval = 10
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        return request
    }
    
}

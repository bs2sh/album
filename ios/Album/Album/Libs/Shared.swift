//
//  Shared.swift
//  Album
//
//  Created by shbaek on 7/8/25.
//
import Foundation

class Shared {
    static var shared: Shared {
        return .init()
    }
    
    private init() {}
    
    func setUserKey(_ key: Int?) {
        UserDefaults.standard.set(key, forKey: "userkey")
        UserDefaults.standard.synchronize()
    }
    
    func userKey() -> Int {
        return UserDefaults.standard.integer(forKey: "userkey")
    }
    
}

func photoUrl(photoPath: String) -> URL {
    let path = photoPath.replacingOccurrences(of: "uploads/imgs/", with: "")
    return URL(string:"http://127.0.0.1:3100/image/\(path)")!
}

func formattedDate(from timestamp: Double) -> String {
    let date = Date(timeIntervalSince1970: timestamp)
    let formatter = RelativeDateTimeFormatter()
    formatter.locale = Locale(identifier: "ko_KR")
    formatter.unitsStyle = .abbreviated
    return formatter.localizedString(for: date, relativeTo: Date())
}

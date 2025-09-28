//
//  Extensions.swift
//  Album
//
//  Created by shbaek on 7/1/25.
//
import Foundation
import SwiftUI



enum GColor {
    static let mainPink = Color(hex: "#db56b5")
}

extension Color {
    init(hex: String, alpha: Double = 1.0) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: UInt64
        switch hex.count {
            case 3: // RGB (12-bit)
                (r, g, b) = ((int >> 8) * 17, ((int >> 4) & 0xF) * 17, (int & 0xF) * 17)
            case 6: // RGB (24-bit)
                (r, g, b) = (int >> 16, (int >> 8) & 0xFF, int & 0xFF)
            default:
                (r, g, b) = (0, 0, 0)
        }
        self.init(.sRGB, red: Double(r) / 255, green: Double(g) / 255, blue: Double(b) / 255, opacity: alpha)
    }
}


extension UIApplication {
    func addTapGestureRecognizer() {
        // 현재 활성화된 씬에서 윈도우를 가져옴 (iOS 15 이상 권장 방식)
        guard let windowScene = connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first else {
            return
        }
        
        let tapRecognizer = UITapGestureRecognizer(target: window, action: #selector(UIView.endEditing))
        tapRecognizer.cancelsTouchesInView = false
        window.addGestureRecognizer(tapRecognizer)
    }
}


extension View {
    // 네비게이션 색상 변경
    func navigationBarTitleTextColor(_ color: Color) -> some View {
        let uiColor = UIColor(color)
        UINavigationBar.appearance().titleTextAttributes = [.foregroundColor: uiColor]
        UINavigationBar.appearance().largeTitleTextAttributes = [.foregroundColor: uiColor]
        return self
    }
    
    func backgroundImage(imageName: String) -> some View {
        self.background(
            Image(imageName)
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()
        )
    }
    
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

// RoundedCorner Shape 정의
struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}

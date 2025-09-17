//
//  CustomTextField.swift
//  Album
//
//  Created by shbaek on 7/1/25.
//
import SwiftUI
import AuthenticationServices

struct CustomTextField : View {
    var placeholder: String
    @Binding var text: String
    var isSecure: Bool = false
    var borderColor: Color = .gray
    
    var body: some View {
        Group {
            if isSecure {
//                SecureField(placeholder, text: $text)
                SecureField(
                    "", // title은 비워둡니다.
                    text: $text,
                    prompt: Text(placeholder)
                        .foregroundColor(.white)
                        .font(.system(size: 15, weight: .bold))
                )
                .textContentType(nil)
                
                    
            } else {
//                TextField(placeholder, text: $text)
                TextField(
                    "", // title은 비워둡니다.
                    text: $text,
                    prompt: Text(placeholder)
                        .foregroundColor(.white)
                        .font(.system(size: 15, weight: .bold))
                )
            }
        }
        .padding()
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(borderColor, lineWidth: 2)
        )
        .font(.system(size: 16))
        .autocapitalization(.none)
//        .disableAutocorrection(true)
        
    }
}



//
//  PhotoDetailView.swift
//  Album
//
//  Created by shbaek on 7/24/25.
//

import SwiftUI
import Kingfisher // Kingfisher를 import 합니다.
/*
struct PhotoDetailView: View {
    // 이미지 URL을 받도록 수정 (Optional URL)
    var photo: Photo?

    // MARK: - 제스처 상태 변수
    
    @State private var scale: CGFloat = 1.0
    @State private var lastScale: CGFloat = 1.0

    @State private var offset: CGSize = .zero
    @State private var lastOffset: CGSize = .zero

    // MARK: - Body
    
    var body: some View {
        GeometryReader { proxy in
            KFImage(photoUrl(photoPath: photo?.photopath ?? ""))
                .placeholder {
                    ProgressView()
                }aaaaa
                .resizable()
                .scaledToFit()
                .scaleEffect(scale)
                .offset(offset)
                .gesture(
                    SimultaneousGesture(
                        magnificationGesture(size: proxy.size),
                        dragGesture(size: proxy.size) // 수정된 제스처가 적용됩니다.
                    )
                )
                .onTapGesture(count: 2) {
                    resetImageState()
                }
                .frame(width: proxy.size.width, height: proxy.size.height)
        }
    }

    // MARK: - 제스처 함수
    
    private func magnificationGesture(size: CGSize) -> some Gesture {
        MagnificationGesture()
            .onChanged { value in
                let delta = value / lastScale
                lastScale = value
                scale = max(scale * delta, 1.0)
                // 줌 변경 시 위치를 즉시 보정합니다.
                fixOffset(size: size)
            }
            .onEnded { _ in
                lastScale = 1.0
            }
    }
    
    /// 드래그 제스처를 처리하는 함수 (수정된 부분)
    private func dragGesture(size: CGSize) -> some Gesture {
        DragGesture()
            // 드래그하는 동안 실시간으로 위치를 제한합니다.
            .onChanged { value in
                // 확대된 상태에서만 이동 가능
                guard scale > 1.0 else { return }
                
                // 이동 가능한 최대 거리 계산
                let scaledImageWidth = (size.width * scale)
                let scaledImageHeight = (size.height * scale)
                
                let maxOffsetX = (scaledImageWidth - size.width) / 2
                let maxOffsetY = (scaledImageHeight - size.height) / 2
                
                // 현재 드래그 위치를 더한 새로운 offset 계산
                var newOffset = CGSize(
                    width: lastOffset.width + value.translation.width,
                    height: lastOffset.height + value.translation.height
                )
                
                // ✅ [핵심] 새로운 offset이 최대 이동 가능 범위를 벗어나지 않도록 제한
                newOffset.width = max(min(newOffset.width, maxOffsetX), -maxOffsetX)
                newOffset.height = max(min(newOffset.height, maxOffsetY), -maxOffsetY)

                // 최종적으로 제한된 offset을 적용
                self.offset = newOffset
            }
            // 드래그가 끝나면 최종 위치를 저장합니다.
            .onEnded { value in
                lastOffset = offset
            }
    }

    // MARK: - 헬퍼 함수
    
    private func resetImageState() {
        withAnimation(.interactiveSpring()) {
            scale = 1.0
            offset = .zero
            lastScale = 1.0
            lastOffset = .zero
        }
    }
    
    /// 줌 제스처 도중 위치를 보정하는 함수
    private func fixOffset(size: CGSize) {
        let scaledImageWidth = (size.width * scale)
        let scaledImageHeight = (size.height * scale)
        
        let maxOffsetX = (scaledImageWidth - size.width) / 2
        let maxOffsetY = (scaledImageHeight - size.height) / 2
        
        var newOffset = lastOffset
        
        newOffset.width = max(min(newOffset.width, maxOffsetX), -maxOffsetX)
        newOffset.height = max(min(newOffset.height, maxOffsetY), -maxOffsetY)
        
        // 애니메이션 없이 즉시 위치를 보정해야 줌과 함께 자연스럽게 움직입니다.
        offset = newOffset
        lastOffset = newOffset
    }
}
*/

struct PhotoDetailView: View {
    @State var photo: Photo?
    
    @State private var scale: CGFloat = 1.0
    @State private var lastScale: CGFloat = 1.0
    
    
    var body: some View {
        VStack {
            ImageZoomView(imageUrl: photoUrl(photoPath: photo?.photopath ?? ""))
        }
        .background(Color.black.opacity(0.95))
        .navigationTitle("상세보기")
        .navigationBarTitleDisplayMode(.inline)
        
    }
}

#Preview {
    let photo = Photo(photokey: "ef6a3309-bf53-4b48-8b76-fa88afb6c318", photopath: "uploads/imgs/1753156284536-image1.jpg", owner: 3, ownernick: "xxxcc", albumkey: "197be471-4109-4602-8041-b3bdda77baf7", regdt: 1753156284558)
    PhotoDetailView(photo: photo)
        
}


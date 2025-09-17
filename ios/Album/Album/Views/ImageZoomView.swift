//
//  ImageZoomView.swift
//  Album
//
//  Created by shbaek on 7/25/25.
//

import SwiftUI

struct ImageZoomView: View {
    let imageUrl: URL
    
    // 최소/최대 스케일값 (사진앱은 실제 상황에 따라 다름, 여기선 예시로 설정)
    let minScale: CGFloat = 1.0
    let maxScale: CGFloat = 5.0
    
    @State private var scale: CGFloat = 1.0
    @State private var lastScale: CGFloat = 1.0
    
    @State private var offset: CGSize = .zero
    @State private var lastOffset: CGSize = .zero
    
    var body: some View {
        GeometryReader { proxy in
            let size = proxy.size
            AsyncImage(url: imageUrl) { phase in
                switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: size.width, height: size.height)
                            .scaleEffect(scale)
                            .offset(offset)
                            .gesture(
                                MagnificationGesture()
                                    .onChanged { value in
                                        let newScale = lastScale * value
                                        scale = max(minScale, min(newScale, maxScale))
                                        offset = clampOffset(offset, scale: scale, size: size)
                                    }
                                    .onEnded { _ in
                                        lastScale = scale
                                        offset = clampOffset(offset, scale: scale, size: size)
                                        lastOffset = offset
                                    }
                            )
                            .simultaneousGesture(
                                DragGesture()
                                    .onChanged { gesture in
                                        guard scale > minScale else { return } // 확대 상태에서만 이동
                                        let newOffset = CGSize(
                                            width: lastOffset.width + gesture.translation.width,
                                            height: lastOffset.height + gesture.translation.height
                                        )
                                        offset = clampOffset(newOffset, scale: scale, size: size)
                                    }
                                    .onEnded { _ in
                                        lastOffset = offset
                                    }
                            )
                            .onTapGesture(count: 2) { location in // iOS17+에서 위치 파라미터 사용
                                let targetScale = (abs(scale - minScale) < 0.01) ? 2.5 : minScale
                                withAnimation(.spring()) {
                                    if targetScale > minScale {
                                        // 탭한 위치를 중심으로 확대
                                        // 위치계산: 이미지와 해당 좌표 계산 필요, 사진앱과 완전 동일하게 하려면 UIView+UIScrollView로 넘어가야 하나,
                                        // SwiftUI 기본으로 최대치까지 접근
                                        let tapped = location
                                        let imgW = size.width * scale
                                        let imgH = size.height * scale
                                        let centerX = tapped.x - size.width / 2
                                        let centerY = tapped.y - size.height / 2
                                        let newOffset = CGSize(
                                            width: offset.width - centerX * (targetScale / scale - 1),
                                            height: offset.height - centerY * (targetScale / scale - 1)
                                        )
                                        scale = targetScale
                                        lastScale = targetScale
                                        offset = clampOffset(newOffset, scale: scale, size: size)
                                        lastOffset = offset
                                    } else {
                                        // 원래 크기, 위치로 복귀
                                        scale = minScale
                                        lastScale = minScale
                                        offset = .zero
                                        lastOffset = .zero
                                    }
                                }
                            }
                            .animation(.interactiveSpring(), value: scale)
                    default:
                        Color.gray
                }
            }
        }
    }
    
    // 바깥 이동 제한
    func clampOffset(_ proposed: CGSize, scale: CGFloat, size: CGSize) -> CGSize {
        let imgW = size.width * scale
        let imgH = size.height * scale
        let horizontalLimit = max(0, (imgW - size.width) / 2)
        let verticalLimit = max(0, (imgH - size.height) / 2)
        let clampedX = min(max(proposed.width, -horizontalLimit), horizontalLimit)
        let clampedY = min(max(proposed.height, -verticalLimit), verticalLimit)
        return CGSize(width: clampedX, height: clampedY)
    }
}

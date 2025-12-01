import SwiftUI
import UIKit

struct UIZoomView: UIViewRepresentable {
    var imageUrl: String
    
    func makeUIView(context: Context) -> some UIView {
        let imageView = ZoomableImageView()
        imageView.imageUrl = imageUrl
        return imageView
    }
    
    func updateUIView(_ uiView: UIViewType, context: Context) {
        
    }
    
}


class ZoomableImageView: UIView, UIScrollViewDelegate {

    // MARK: - Public Properties
    
    var imageUrl: String? {
        didSet {
            // URL이 변경되면 비동기 로딩 시작
            loadImage(from: imageUrl)
        }
    }
    
    var image: UIImage? {
        didSet {
            updateImageDetails()
        }
    }
    
    // MARK: - Private Properties
    
    private let scrollView = UIScrollView()
    private let imageView = UIImageView()
    
    // 기존 DataTask 대신 Task를 사용하여 비동기 작업을 관리합니다.
    private var imageLoadingTask: Task<Void, Never>?
    
    // MARK: - Initializers
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setup()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setup()
    }
    
    // MARK: - Setup Methods
    
    private func setup() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.delegate = self
        scrollView.minimumZoomScale = 1.0
        scrollView.maximumZoomScale = 3.0
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.showsVerticalScrollIndicator = false
        addSubview(scrollView)
        
        imageView.contentMode = .scaleAspectFit
        scrollView.addSubview(imageView)
        
        NSLayoutConstraint.activate([
            scrollView.leadingAnchor.constraint(equalTo: self.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: self.trailingAnchor),
            scrollView.topAnchor.constraint(equalTo: self.topAnchor),
            scrollView.bottomAnchor.constraint(equalTo: self.bottomAnchor)
        ])
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(doubleTap(_:)))
        tap.numberOfTapsRequired = 2
        scrollView.addGestureRecognizer(tap)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        updateZoomScales()
        centerImageView()
    }
    
    // MARK: - Image Loading Logic (Async/Await)
    
    private func loadImage(from urlString: String?) {
        // 1. 이전에 진행 중이던 다운로드 작업이 있다면 취소합니다.
        imageLoadingTask?.cancel()
        
        print("image url : >> \(urlString ?? "nil")")
        
        guard let urlString = urlString, let url = URL(string: urlString) else {
            self.image = nil
            return
        }
        
        // 2. 새로운 Task 생성 (UIView 내부이므로 MainActor 컨텍스트를 상속받음)
        imageLoadingTask = Task {
            // (선택 사항) 로딩 시작 전 기존 이미지 초기화 혹은 플레이스홀더 처리
            // self.image = nil
            
            do {
                // 3. 비동기 데이터 요청 (URLSession.shared.data(from:) 사용)
                let (data, _) = try await URLSession.shared.data(from: url)
                
                // 4. Task가 취소되었는지 확인 (이미지 뷰가 재사용되거나 URL이 바뀐 경우)
                if Task.isCancelled { return }
                
                guard let downloadedImage = UIImage(data: data) else { return }
                
                // 5. UI 업데이트
                // Task가 MainActor(@MainActor)인 UIView 컨텍스트 내에서 생성되었으므로,
                // await 이후 돌아오는 시점에도 메인 스레드가 보장됩니다.
                // 따라서 DispatchQueue.main.async가 필요 없습니다.
                self.image = downloadedImage
                
            } catch {
                // 에러 처리 (취소된 에러는 무시)
                if let error = error as? URLError, error.code == .cancelled {
                    return
                }
                print("Image loading failed: \(error)")
            }
        }
    }
    
    // MARK: - Image Display Logic
    
    private func updateImageDetails() {
        guard let image = image else {
            imageView.image = nil
            imageView.frame = .zero
            scrollView.contentSize = .zero
            return
        }
        
        imageView.image = image
        imageView.frame = CGRect(origin: .zero, size: image.size)
        scrollView.contentSize = image.size
        
        let boundsSize = self.bounds.size
        if boundsSize.width > 0 && boundsSize.height > 0 {
            updateZoomScales()
            scrollView.zoomScale = scrollView.minimumZoomScale
            centerImageView()
        }
    }
    
    private func updateZoomScales() {
        guard let image = image, bounds.width > 0, bounds.height > 0 else { return }
        
        let imageSize = image.size
        let boundsSize = bounds.size
        
        let widthRatio = boundsSize.width / imageSize.width
        let heightRatio = boundsSize.height / imageSize.height
        let minScale = min(widthRatio, heightRatio)
        
        scrollView.minimumZoomScale = minScale
        
        if scrollView.zoomScale < minScale {
            scrollView.zoomScale = minScale
        }
    }
    
    private func centerImageView() {
        guard image != nil else { return }
        
        let boundsSize = scrollView.bounds.size
        var contentsFrame = imageView.frame
        
        if contentsFrame.width < boundsSize.width {
            contentsFrame.origin.x = (boundsSize.width - contentsFrame.width) / 2.0
        } else {
            contentsFrame.origin.x = 0.0
        }
        
        if contentsFrame.height < boundsSize.height {
            contentsFrame.origin.y = (boundsSize.height - contentsFrame.height) / 2.0
        } else {
            contentsFrame.origin.y = 0.0
        }
        
        imageView.frame = contentsFrame
    }
    
    @objc private func doubleTap(_ tap: UITapGestureRecognizer) {
        if scrollView.zoomScale > scrollView.minimumZoomScale {
            scrollView.setZoomScale(scrollView.minimumZoomScale, animated: true)
        } else {
            scrollView.setZoomScale(scrollView.maximumZoomScale, animated: true)
        }
    }
    
    // MARK: - UIScrollViewDelegate
    
    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
        return imageView
    }
    
    func scrollViewDidZoom(_ scrollView: UIScrollView) {
        centerImageView()
    }
}

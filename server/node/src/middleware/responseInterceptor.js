const responseInterceptor = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function (body) {
    // 여기에 암호화 로직이나 공통 응답 포맷팅을 추가할 수 있습니다.
    console.log('Intercepted response body:', typeof body === 'object' ? JSON.stringify(body) : body);
    
    // 원래의 json 함수 호출
    return originalJson.call(this, body);
  };

  next();
};

module.exports = responseInterceptor;

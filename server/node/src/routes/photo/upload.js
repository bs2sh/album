const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const photoDB = require('../../db/photoDB')
const { rejects } = require('assert')

const uploadDir = 'uploads/imgs'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

setupUploadDirectory()


// 쓰기 권한 확인
try {
  fs.accessSync(uploadDir, fs.constants.W_OK);
  console.log('✅ 업로드 디렉터리 쓰기 권한 OK');
} catch (error) {
  console.error('❌ 업로드 디렉터리 쓰기 권한 없음:', error);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 파일명 중복을 피하기 위해 더 고유한 값 사용
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// upload.array 대신 upload.fields를 사용하여 여러 필드를 정의합니다.
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB 파일 사이즈 제한 (옵션)
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다. (jpeg, jpg, png, gif, webp)'));
    }
  }
}).fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 },
  // 설명 필드는 파일이 아니므로 multer에서 처리하지 않고 req.body로 직접 받습니다.
]);


// 업로드 디렉토리 설정 
async function setupUploadDirectory() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`업로드 디렉토리 생성: ${this.uploadDir}`);
  }
}

router.post('/upload', upload, async (req, res) => {
  try {
    // 요청 전체를 확인하기 위한 로그
    console.log('=== 전체 요청 데이터 로그 ===');
    console.log('req.body (텍스트 데이터):', JSON.stringify(req.body, null, 2));
    console.log('req.files (파일 데이터):', req.files);
    console.log('============================');

    const { userkey, usernick, albumkey } = req.body;

    // req.files는 이제 배열이 아닌 객체입니다. 객체가 비어있는지 확인합니다.
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ result: 0, msg: '업로드할 이미지가 없습니다.' });
    }

    const dbPromises = [];

    // 최대 5개의 이미지/설명 쌍을 처리하기 위해 반복문을 사용합니다.
    for (let i = 1; i <= 5; i++) {
      const imageField = `image${i}`;
      const descriptionField = `description${i}`;

      // 해당 필드에 파일이 있는지 확인합니다.
      if (req.files[imageField] && req.files[imageField][0]) {
        const file = req.files[imageField][0];
        const description = req.body[descriptionField] || ''; // 설명이 없으면 빈 문자열로 처리

        console.log(`[처리 중] 이미지: ${file.filename}, 설명: "${description}"`);

        // 데이터베이스에 저장하는 Promise 생성 (description 추가)
        const dbPromise = photoDB.addPhoto(
          file.path,
          description, // 설명 파라미터 추가
          userkey,
          usernick,
          albumkey,
          Date.now()
        );
        dbPromises.push(dbPromise);
      }
    }

    // 모든 데이터베이스 작업을 병렬로 실행하고 기다립니다.
    const dbResults = await Promise.all(dbPromises);
    console.log('DB 저장 결과:', dbResults);

    const ret = { result: 1, msg: '성공적으로 업로드되었습니다.', paths: dbResults };
    res.status(201).json(ret);

  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    res.status(500).json({
      result: 0,
      msg: error.message || '서버 내부 오류가 발생했습니다.'
    });
  }
});


/*
router.post('/upload', upload.array('images', 5), async (req, res) => {
  try {

    console.log('=== 전체 요청 데이터 로그 ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    console.log('req.files:', req.files);
    console.log('req.params:', req.params);
    console.log('req.query:', req.query);
    console.log('req.headers:', req.headers);
    console.log('================================');

    let { userkey, usernick, albumkey } = req.body

    if (req.files == null || req.files.length === 0) {
      let json = { result: 0, msg: '업로드할 이미지가 없습니다.' }
      return res.json(json)
    }

    const uploadFiles = []
    const dbPromises = []

    for (const file of req.files) {
      console.log('>> ' + uploadDir + ' / ' + file.filename)
      const filePath = path.join(uploadDir, file.filename)

      uploadFiles.push({
        filename: file.filename,
        originalName: file.originalName,
        path: filePath,
        size: file.size
      })

      //데이터베이스에 저장하는 Promise 생성
      const dbPromise = photoDB.addPhoto(filePath, userkey, usernick, albumkey, Date.now())
      dbPromises.push(dbPromise)
    }

    const dbResults = await Promise.all(dbPromises)
    console.log('dbResults >>>>')
    console.log(dbResults)
    // let paths = dbResults.map(result => result.filePath)
    // console.log(paths)

    let ret = { result: 1, msg: '', paths: dbResults }
    res.json(ret)
  } catch (error) {
    console.error('이미지 업로드 오류', error)
    res.status(500).json({
      result: 0,
      msg: error.messagee
    })
  }
})
*/


module.exports = router
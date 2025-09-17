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

// var upload = multer({
//     storage: storage,
//     limits: {
//         // fileSize: 5 * 1024 * 1024, // 5MB 제한
//         files: 5 // 최대 5개 파일
//     }
//     // fileFilter: fileFilter
// });

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         console.log('3333333333333')
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         // 파일명 중복 방지를 위해 타임스탬프 추가
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);        
//         cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//     }
// });

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('✅ destination 콜백 호출됨');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log('✅ filename 콜백 호출됨');
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var upload = multer({ storage: storage });


// 파일 필터 (이미지만 허용)
var fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'));
  }
};

// 업로드 디렉토리 설정 
async function setupUploadDirectory() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`업로드 디렉토리 생성: ${this.uploadDir}`);
  }
}


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


/*
// 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/imgs/'); // 저장 폴더
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + '_' + Date.now() + ext); // 유니크한 파일명
  }
});

const upload = multer({ storage: storage }).fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
])

router.post('/upload', upload, async (req, res) => {
    console.log('photo >> ' + req.body)
    // console.log('photo upload >> ' + req.file.path + ' / ' + req.file.filename)    
    const images = []
    for (let i = 1; i <= 5; i++) {
        const key = 'image' + i
        if (req.files[key]) {
            // 업로드 경로: req.files[key][0].path 또는 req.files[key][0].filename
            images.push({
                field: key,
                path: req.files[key][0].path    // 'uploads/파일이름' 등 실제 파일의 상대 경로
            })
        }
    }

    let { userkey, usernick, albumkey } = req.body
    let msg = ''
    let paths = []
    // 이미지 가져왔으니 일단 DB에 넣자.
    for ({field, path} in images) {
        console.log('upload image : ' + field + ' / ' + path)
        try {
            const photokey = await photoDB.addPhoto(path, userkey, usernick, albumkey, Date.now())
            paths.push(path)
            print('insert photo ::: ' + photokey)
        } catch (err) {
            console.log('/photo/upload Error >> ' + err.message)
            msg = err.message
        }
    }
    let result = 1
    if (msg.length > 0) {
        result = 0
    } 
    
    let ret = {result: 1, msg: msg, paths: paths}
    res.json(ret)

})
*/
module.exports = router
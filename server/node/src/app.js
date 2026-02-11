const express = require("express");
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// 라우팅
const responseInterceptor = require('./middleware/responseInterceptor');
app.use(responseInterceptor);

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// 이미지
let imagePath = path.join(__dirname + '/../uploads/imgs');
app.use('/image', express.static(imagePath));

const port = 3100;
app.listen(port, () => {
  console.log("start server >>> " + port);
});

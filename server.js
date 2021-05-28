const express = require('express'); // 설치한 라이브러리 첨부
const app = express(); // 첨부한 라이브러리로 새로운 객체 생성

app.listen(8080, function () {
    console.log("listening on 8080");
});

// 위 생성한 객체를 listen()를 통해 서버 열음
// listen() 파라미터 1: 포트 파라미터 2: 서버 오픈시 실행할 코드 콜백함수로(함수 내부 함수 >> 순차처리를 위함)

app.get('/pet', function (req, res) { // localhost:8080/pet
    res.send('펫용품 대문');
});

app.get('/beauty', function (req, res) {
    res.send('뷰티용품 사세요');
});

//get(경로, function(요청, 응답){
//   응답.send(~)
//});

/*  5/28 : GET요청 해보기

    서버파일은 server.js로 (저번에 npm init으로 지정한 entry point)

    node.js에서 express로 서버를 만들기 위한 기본 문법

    const express = require('express');
    const app = express();

    app.listen();

    listen() 파라미터 1: 포트 파라미터 2: 콜백함수로 서버 열었을때 무엇을 할지]

    port: 컴퓨터에서 외부와 통신을 하기 위한 통로(대충 60000개) >> 해당 통로로 들어온 경우 해당 작업을 시키기 위한 listen()


    서버 실행은 node server.js (서버 끄는건 터미널 커서에 ctrl c)

*/


const express = require('express'); // 설치한 라이브러리 첨부
const app = express(); // 첨부한 라이브러리로 새로운 객체 생성
const MongoClient = require('mongodb').MongoClient;

app.use(express.urlencoded({ extended: true })); // body-parser 이용

const dbConnectUrl =
    "mongodb+srv://<dbId>:<dbPw>@cluster0.obx3d.mongodb.net/<dbname>?retryWrites=true&w=majority";

let db;

MongoClient.connect(dbConnectUrl, { useUnifiedTopology: true }, (err, client) => {
    // connect(url, options, callback) 구조로 { useUnifiedTopology: true } Warning이 생겼을 경우 { useUnifiedTopology: true }를(Enables the new unified topology layer) 옵션에 넣는다

    if (err) return console.log(err);

    db = client.db('node_ex_todoapp');
    // 위에 선언한 변수에 DB 연결 정보 참조 >> db접속
    // 필요할 때 그냥 client.db(‘node_ex_todoapp’).collection(‘post’).insertOne(추가할 자료, 콜백함수) 이렇게 써도 됨

    app.listen('8000', () => {
        console.log('listening on 8000');
    });
});

// app.listen(8000, function () {
//     console.log("listening on 8000");
// });

// 위 생성한 객체를 listen()를 통해 서버 열음
// listen() 파라미터 1: 포트 파라미터 2: 서버 오픈시 실행할 코드 콜백함수로(함수 내부 함수 >> 순차처리를 위함)

app.get('/pet', function (req, res) { // localhost:8080/pet
    res.send('펫용품 대문');
});

app.get('/beauty', function (req, res) {
    res.send('뷰티용품 사세요');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
}); // '/'면 index 즉 홈이다

app.get("/todo", function (req, res) {
    res.sendFile(__dirname + "/todo.html");
});

//get(경로, function(요청, 응답){ >> 요청 파라미터에서는 요청 데이터 전부 포함됨
//   응답.send(~)
//});

app.post("/todo", (req, res) => { //여기서도 input을 name으로 구분
    console.log(req.body.toDo); // req.body.name으로 꺼낸다

    let save = { "toDo": req.body.toDo, "dueDate": req.body.dueDate, "toDoDetail": req.body.toDoDetail };

    db.collection('post').insertOne(save, (err, result) => {

        if (err) console.log(err);
        console.log("save complete");
    });
});

/*  5/29 : MongoDB 세팅

    파일 저장 / 파일보단 엑셀 / 엑셀보단 DB : 용량 보안 일관성

    관계형 DB(2차원) : 3차원 자료 매핑 테이블이 필요함 + SQL 필요

    NoSQL : 행/열 구분되는 DB가 아님 / Object자료형으로 입출력 가능 / Dynamo, Oracle NoSQL, MongoDB, Redis, Cassandra
    >> 컬럼 등 신경 쓸게 많은 관계형과 달리 데이터 입출력만 신경써도 됨

    여기서는 MongoDB를 무료 호스팅 받아서(대략 512MB) 사용해보기 : MongoDB Atlas
    클라우드 서비스를 이용하는 편이 실제 사이트 배포시 유리 > 접속 속도 / 급격한 사용자 증가에 대한 용량문제 / 백업 등

    MongoDB Atlas 가입 >> 무료 Cluster 생성 >> 가까운 지역의 클라우드 서비스 선택 후 Create Cluster
    Database Access 메뉴에서 Add New Database User로 새 DB ID/PW 생성
    Network Access 메뉴에서 IP 추가 (DB 접속 IP를 미리 정하는 보안장치 만약 어디서나 가능하게 하려면 ALLOW ACCESS FROM ANYWHERE 현재 IP의 경우 ADD CURRENT IP ADDRESS)
    Clusters 메뉴의 Connet (이 경우 Application 커넥트로 선택) 이후 연동 URL 받아옴

    MongoDB 접속 라이브러리 설치
    npm install mongodb
    만약 에러시 npm install mongodb@3.6.4(버전)

    const MongoClient = require('mongodb').MongoClient; 로 객체 생성 후

    MongoClient.connect('사이트에서 받아온 연동 URL', (err, client)=>{
        if(err) return console.log(err);

        app.listen('8000', ()=>{ << 서버를 오픈하는 코드를 이쪽으로 옮겨야한다 (db 연동 후 서버 오픈)
            console.log('listening on 8000');
        });
    });


    이후 MongoDB Altras에서 저장할 Collection 생성(Cluster > Collection > Add my own data)
    Collection : DB의 각 저장 공간? (흠... 테이블?) (코딩 애플 DB를 폴더로 Collection을 파일로 생각하면 편하다 캄)

    변수(db) 선언을 하여 connet의 콜백함수 안에 client.db('db명')으로 db 연결정보를 참조하고

    db.collection('콜렉션명').insertOne(저장데이터, (에러,결과)=>{})하면 데이터 하나 insert 여기서부턴 먼가 기존 하던 작업하고 유사하네 함수명이

    >> 저장데이터 형식은 {key:value} JS Object, JSON 형식으로

*/

/*  https://velopert.com/436

    NoSQL : Not Only SQL : 기존 RDBMS 한계 극복을 위한 DB >> 고정된 스키마나 JOIN이 존재하지 않음

    >> (Schema-less)스키마가 없음 >> 각 객체의 구조가 뚜렷하며 복잡한 JOIN이 없음 >> App 객체 추가 시 Conversion / Mapping이 불필요
    >> (Deep Query Ablility) 문서(Document)지향적 Query Language를 사용하며 SQL만큼 강력한 쿼리성능(이건 뭐 그렇다고 하니까)


    Document : RDBMS 레코드와 비슷한 개념 한 개 이상의 key-value 페어로 이뤄짐
             : _id (key)는 12bytes documents의 uniquenesss 제공(4:timestamp / 3:machin id / 2: mongodb 프로세스 id / 3: 순차번호)
             : _id는 지정가능하면 지정 안하면 위와같이 알아서 생성됨
             : 동적 스키마를 가져 같은 Collection의 Document는 서로 다른 key를 가질 수 있음 (심지어 데이터 타입도 알아서 세팅됨)

             : 만약 기존에 RDBMS에서 PK-FK 관계 생성 후 JOIN 데이터 저장 대신
                >> key : value에서 다시 value에 {key:value}의 객체를 넣어서 처리한다

    Collection : Document 그룹 / RDBMS의 table과 유사한 개념이나 각 Doc가 동적스키마를 가짐으로 스키마를 갖진 않음

    Database : Collection들의 물리적인 Container

    https://velopert.com/mongodb-tutorial-list

    >> 이후 쿼리 메소드는 차차 찾기로 함

*/

/*  5/29

    nodemon : server 재실행 자동화 (저장 발생시 자동 재실행)
    npm install -g nodemon
    -g는 모든 컴퓨터 폴더에서 사용한다는 표시(global / yarn add global nodemon)

    실행은 nodemon server.js
    만약 보안오류 발생 시 powershell을 관리자 권한으로 실행하여
    executionpolicy 입력
    Restricted로 되어 있다면 set-executionpolicy unrestricted로 y로 변경


    sendFile(파일 경로)로 html파일 등 보낼 수 있음
    __dirname : 현재 실행 중인 폴더 경로
    __filename : 현재 실행 중인 파일 경로


    JS에서는 순차실행을 위해 콜백함수를 굉장히 많이 쓴다
    근데 es6에서 arrow function이 추가 ()=>{} : 그냥 편한것도 있지만 this의 지정이 상위요소를 정확히 가르키기에도 사용

    POST 등의 요청 시 가져온 BODY의 내용을 쉽게 사용하기 위한 라이브러리 : body-parser : Body 해석
    npm install body-parser
    server.js에
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true}));
    를 추가

    21년 이후 최신 프로젝트들은 express에 body-parser라이브러리가 기본 포함이기 때문에
    위 설치 없이 아래만 추가하면 됨
    app.use(express.urlencoded({extended: true}))

    웹서비스 기능만들기 기능
    1. 서버로 데이터를 전송할 수 있는 UI 만들기
    2. 서버에서 해당 데이터를 처리할 기능 작성

*/

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


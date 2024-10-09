const express = require('express')
const cors = require('cors');
const app = express()

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key';

const posts = require('./mockdata/posts');
const comments = require('./mockdata/comments');

let post = [...posts];
let comment = [...comments];

let pid = post.length - 1;
let cid = comment.length - 1;
const users = []
let uid = 0;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})

app.get('/', (req, res) => {
    res.send(post)
})

app.get('/post/:id', (req, res) => {
    const req_post = post.find(item => item.id == req.params.id)
    console.log(`${req.params.id}번 게시글을 전송합니다.`)
    console.log(req_post)
    res.send(req_post)
})

app.post('/', (req, res) => {
    const data = req.body
    data.id = pid++;
    post.push(req.body)
    console.log(post)
})

app.delete('/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    console.log(postId + '번 게시글 삭제 요청');

    // 게시글을 찾아서 삭제
    const postIndex = post.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        post.splice(postIndex, 1);
        res.status(200).send({ message: 'Post deleted successfully' });
    } else {
        res.status(404).send({ message: 'Post not found' });
    }
});


app.put('/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const updatedData = req.body;
    console.log(postId + '번 게시글 수정 요청', updatedData);

    const postIndex = post.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        post[postIndex] = { ...post[postIndex], ...updatedData };
        res.status(200).send({ message: 'Post updated successfully', post: [postIndex] });
    } else {
        res.status(404).send({ message: 'Post not found' });
    }
});

app.post('/comment', (req, res) => {
    console.log(req.body)
    const data = req.body
    data.id = cid++;
    comment.push(req.body)
    console.log(comment)
});

app.get('/comment/:id', (req, res) => {
    const commentsOfPost = []
    comment.forEach((data) => {
        if (data.postId == req.params.id)
            commentsOfPost.push(data);
    });
    console.log(`${req.params.id}번 게시글의 댓글들을 전송합니다.`);
    console.log(commentsOfPost);
    res.send(commentsOfPost);
});

// 회원가입
app.post('/register', (req, res) => {
    const { username, password, displayname } = req.body;

    // 간단한 유효성 검사 (이미 등록된 유저 확인)
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
    }

    // 새로운 유저 추가
    const newUser = {
        id: uid++,
        username,
        password,
        displayname
    };
    users.push(newUser);

    // 회원가입 성공 응답
    res.status(201).json({ message: '회원가입 성공', user: newUser });

    console.log(users);
});

// 로그인
app.post('/login', (req, res) => {
    const { username, password, displayname } = req.body;

    // 유저 검증
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // JWT 생성
    const token = jwt.sign({ id: user.id, username: user.username, displayname: user.displayname }, SECRET_KEY, { expiresIn: '1h' });

    // 로그인 성공 시 토큰 반환
    res.json({ message: '로그인 성공', token });
    console.log('Logged in');
});

// 인증 정보 검사 (JWT 인증 필요)
app.get('/auth', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    const token = authHeader.split(' ')[1];

    // 토큰 검증
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        }

        // 인증 성공
        res.json({ message: '인증 성공', user });
    });
});
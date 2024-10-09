const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key';
let users = [];
let uid = 0;

const registerUser = (req, res) => {
    const { username, password, displayname } = req.body;
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
    }

    const newUser = { id: uid++, username, password, displayname };
    users.push(newUser);
    res.status(201).json({ message: '회원가입 성공', user: newUser });
};

const loginUser = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, displayname: user.displayname }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: '로그인 성공', token });
};

const authUser = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        }
        res.json({ message: '인증 성공', user });
    });
};

module.exports = {
    registerUser,
    loginUser,
    authUser
};

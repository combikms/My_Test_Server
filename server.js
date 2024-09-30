const express = require('express')
const cors = require('cors');
const app = express()

const post = [
    {
        title: '학교 근로하면 달에 얼마받아요?',
        content: '평균',
        id: 0
    },
    {
        title: '침착맨 전문 시청 1팀 카드지갑 잃어버리신 분?',
        content: '쪽지주세용 (조공 있으면 더 좋고 ㅎ 농담임)',
        id: 1
    },
    {
        title: '수강꾸러미',
        content: '확정 뜨는게 언제였지? 왜 확정 전이라 뜨냐',
        id: 2
    },
    {
        title: '반시공님들',
        content: '상담내용에머씀?난 그냥 교육과정대로 잘했는지 적었는데.\n' +
            '그리고 이번주 화욜에 제출했는데 아직까지 미승인인데 다들 승인남?지도교수ㅇㅇㅇ 임',
        id: 3
    }
]

const comment = [
    { postId: '0', username: '강인석', content: '100마넌', id: 0 },
    { postId: '0', username: '정우제', content: '70마넌', id: 1 },
    { postId: '1', username: '여원용', content: '싫어', id: 2 },
    { postId: '1', username: '박동수', content: '고마워', id: 3 },
    { postId: '1', username: '강인석', content: '저요!', id: 4 },
    { postId: '2', username: '홍길동', content: '알아서 찾아봐', id: 5 }
]


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
    if (post.length == 0) {
        data.id = 0
    } else {
        data.id = post[post.length - 1].id + 1
    }
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
    if (comment.length == 0) {
        data.id = 0
    } else {
        data.id = comment[comment.length - 1].id + 1
    }
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

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let reportData = {
  date: '',
  weather: '',
  person: '',
  activity: '',
  etc: ''
};

io.on('connection', (socket) => {
  console.log('사용자 접속:', socket.id);

  // 현재 데이터 보내기
  socket.emit('initData', reportData);

  // 데이터 업데이트 받기
  socket.on('updateData', (data) => {
    reportData = { ...reportData, ...data };
    // 다른 사용자에게 업데이트 알림
    socket.broadcast.emit('updateData', data);
  });

  socket.on('disconnect', () => {
    console.log('사용자 연결 종료:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});



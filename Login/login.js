// 后端示例代码（需要独立部署）
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());

// 数据库配置
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查询用户
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: '用户不存在'
      });
    }

    const user = users[0];
    
    // 验证密码
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: '密码错误'
      });
    }

    // 生成令牌（示例，实际应使用JWT等标准方案）
    const authToken = generateAuthToken(user.id);

    res.json({
      success: true,
      token: authToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

function generateAuthToken(userId) {
  // 实际应使用JWT等标准方案生成令牌
  return `mock-token-${userId}-${Date.now()}`;
}

app.listen(3000, () => {
  console.log('API服务器运行在端口3000');
});
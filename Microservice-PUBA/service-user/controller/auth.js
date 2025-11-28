const db = require('../config/mysql-config');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/authMiddleware');

exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({
      error: 'Email, Password, role wajib diisi.',
    });
  }
  try {
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, existingUser) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Server error saat cek email.' });
      }

      if (existingUser.length > 0) {
        return res.status(409).json({
          error: 'Email sudah terdaftar.',
        });
      }
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        db.query('INSERT INTO user (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Gagal menyimpan user.' });
          }
          res.status(201).json({
            message: 'Registrasi berhasil.',
            user: {
              id: result.insertId,
              email,
              role,
            },
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Terjadi kesalahan pada server.',
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email dan Password wajib diisi.',
    });
  }
  try {
    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: 'Terjadi kesalahan pada server.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          error: 'Email tidak ditemukan.',
        });
      }
      const user = results[0];

      try {
        // Verifikasi password dengan bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({
            error: 'Password salah.',
          });
        }

        const token = generateToken({
          id: user.id,
          email: user.email,
        });
        res.status(200).json({
          message: 'Login berhasil.',
          token: token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        });
      } catch (compareError) {
        console.log(compareError);
        return res.status(500).json({
          error: 'Gagal memverifikasi password.',
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Terjadi kesalahan pada server.',
    });
  }
};

exports.logout = (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: 'User ID tidak ditemukan',
      });
    }
    res.status(200).json({
      message: 'Logout berhasil. Silakan hapus token di client side.',
      userId: userId,
      logoutTime: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat logout.',
    });
  }
};

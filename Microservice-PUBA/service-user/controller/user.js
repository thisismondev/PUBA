const db = require('../config/mysql-config');

exports.getAllUsers = async (req, res) => {
  try {
    const query = 'SELECT id, email, role FROM user';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({
          error: 'Gagal mengambil data users',
        });
      }
      
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Terjadi kesalahan pada server',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    
    const query = 'DELETE FROM user WHERE id = ?';
    
    db.query(query, [idUser], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({
          error: 'Gagal menghapus user',
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: 'User tidak ditemukan',
        });
      }
      
      return res.status(200).json({
        message: 'User berhasil dihapus',
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Terjadi kesalahan pada server',
    });
  }
};

exports.getFakultas = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        namaFakultas, 
        programStudi, 
        jenjang, 
        kode
      FROM fakultas
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: 'Gagal mengambil data fakultas',
        });
      }

      return res.status(200).json({
        message: 'Berhasil mengambil data fakultas',
        data: results,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Terjadi kesalahan pada server',
    });
  }
};

exports.insertUser = (req, res) => {
  const { nameMhs, nimMhs, id_fakultas, thnMasuk, thnLulus, semester, status } = req.body;

  const idUser = req.user.id;

  // Validasi field wajib
  if (!nameMhs || !nimMhs || !id_fakultas || !thnMasuk || !semester || !status) {
    return res.status(400).json({
      error: 'Semua field wajib diisi (kecuali thnLulus jika belum lulus)',
    });
  }

  // Validasi enum
  const allowedStatus = ['Aktif', 'Lulus', 'Cuti', 'Dropout'];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      error: `Status tidak valid. Gunakan salah satu: ${allowedStatus.join(', ')}`,
    });
  }

  // Cek apakah user sudah memiliki data mahasiswa
  const checkQuery = 'SELECT id FROM mahasiswa WHERE id_user = ?';

  db.query(checkQuery, [idUser], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('MySQL check error:', checkErr);
      return res.status(500).json({
        error: 'Gagal memeriksa data mahasiswa',
      });
    }

    // Jika sudah ada data, tolak insert
    if (checkResults.length > 0) {
      return res.status(409).json({
        error: 'Data mahasiswa Anda sudah ada. Gunakan endpoint update untuk mengubah data.',
      });
    }

    // Jika belum ada, lakukan insert
    const query = `
      INSERT INTO mahasiswa 
      (nameMhs, nimMhs, id_fakultas, id_user, thnMasuk, thnLulus, semester, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [nameMhs, nimMhs, id_fakultas, idUser, thnMasuk, thnLulus || null, semester, status];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('MySQL insert error:', err);
        return res.status(500).json({
          error: 'Gagal menambahkan data mahasiswa',
        });
      }

      return res.status(201).json({
        message: 'Data mahasiswa berhasil ditambahkan',
        data: {
          id: result.insertId,
          nameMhs,
          nimMhs,
          id_fakultas,
          id_User: idUser,
          thnMasuk,
          thnLulus: thnLulus || null,
          semester,
          status,
        },
      });
    });
  });
};

exports.updateUser = (req, res) => {
  // Cek apakah req.body ada
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Request body tidak boleh kosong',
    });
  }

  const { nameMhs, nimMhs, id_fakultas, thnMasuk, thnLulus, semester, status } = req.body;

  const idUser = req.user.id; // Ambil dari token

  // Validasi field wajib
  if (!nameMhs || !nimMhs || !id_fakultas || !thnMasuk || !semester || !status) {
    return res.status(400).json({
      error: 'Semua field wajib diisi (kecuali thnLulus jika belum lulus)',
    });
  }

  // Validasi enum status
  const allowedStatus = ['Aktif', 'Lulus', 'Cuti', 'Dropout'];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      error: `Status tidak valid. Gunakan salah satu: ${allowedStatus.join(', ')}`,
    });
  }

  // Cek apakah data mahasiswa ada
  const checkQuery = 'SELECT id FROM mahasiswa WHERE id_user = ?';

  db.query(checkQuery, [idUser], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('MySQL check error:', checkErr);
      return res.status(500).json({
        error: 'Gagal memeriksa data mahasiswa',
      });
    }

    // Jika belum ada data, tolak update
    if (checkResults.length === 0) {
      return res.status(404).json({
        error: 'Data mahasiswa tidak ditemukan. Silakan insert data terlebih dahulu.',
      });
    }

    // Jika ada, lakukan update
    const updateQuery = `
      UPDATE mahasiswa 
      SET nameMhs = ?, 
          nimMhs = ?, 
          id_fakultas = ?, 
          thnMasuk = ?, 
          thnLulus = ?, 
          semester = ?, 
          status = ?
      WHERE id_user = ?
    `;

    const values = [nameMhs, nimMhs, id_fakultas, thnMasuk, thnLulus || null, semester, status, idUser];

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error('MySQL update error:', err);
        return res.status(500).json({
          error: 'Gagal mengupdate data mahasiswa',
        });
      }

      return res.status(200).json({
        message: 'Data mahasiswa berhasil diupdate',
        data: {
          nameMhs,
          nimMhs,
          id_fakultas,
          id_User: idUser,
          thnMasuk,
          thnLulus: thnLulus || null,
          semester,
          status,
        },
      });
    });
  });
};

exports.getUserById = (req, res) => {
  const idUser = req.params.idUser;

  const query = `
      SELECT 
        id,
        email,
        role
      FROM user
      WHERE id = ?
  `;

  db.query(query, [idUser], (err, results) => {
    if (err) {
      console.error('MySQL error:', err);
      return res.status(500).json({ error: 'Gagal mengambil data user' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.status(200).json(results[0]);
  });
};

-- Create user table
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) DEFAULT 'user',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create fakultas table
CREATE TABLE IF NOT EXISTS `fakultas` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `kodeFakultas` VARCHAR(50) NOT NULL,
    `namaFakultas` VARCHAR(255) NOT NULL,
    `programStudi` VARCHAR(255) DEFAULT NULL,
    `thnMasuk` INT DEFAULT NULL,
    `thnLulus` INT DEFAULT NULL,
    `semester` INT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `kodeFakultas` (`kodeFakultas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create mahasiswa table
CREATE TABLE IF NOT EXISTS `mahasiswa` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nameMhs` VARCHAR(255) NOT NULL,
    `nimMhs` VARCHAR(20) NOT NULL,
    `status` VARCHAR(50) DEFAULT NULL,
    `id_fakultas` INT NOT NULL,
    `id_user` INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `nimMhs` (`nimMhs`),
    KEY `id_fakultas` (`id_fakultas`),
    KEY `id_user` (`id_user`),
    CONSTRAINT `mahasiswa_ibfk_1` FOREIGN KEY (`id_fakultas`) REFERENCES `fakultas` (`id`),
    CONSTRAINT `mahasiswa_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data for fakultas
INSERT IGNORE INTO `fakultas` (`kodeFakultas`, `namaFakultas`, `programStudi`, `thnMasuk`, `thnLulus`, `semester`) 
VALUES 
    ('FIK', 'Fakultas Ilmu Komputer', 'Teknik Informatika', 2022, 2026, 8),
    ('FEB', 'Fakultas Ekonomi dan Bisnis', 'Sistem Informasi', 2022, 2026, 6);

-- Insert sample admin user (password: admin123 - needs to be hashed with bcrypt)
-- You need to replace this with actual bcrypt hash
INSERT IGNORE INTO `user` (`email`, `password`, `role`) 
VALUES ('admin@example.com', '$2b$10$vgClqAi2B9ZkJLJ8q9mBou8OeThUzUgJbFA6DtTKFmW53H17gRjtS', 'admin');

-- Insert sample regular user (password: user123)
INSERT IGNORE INTO `user` (`email`, `password`, `role`) 
VALUES ('user@example.com', '$2b$10$6IxIfSJWe3wA6Gb6wXDDD.AWnZCPdoY054ryfBV1NvR/XonwxzVzG', 'user');


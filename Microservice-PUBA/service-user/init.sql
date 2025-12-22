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

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO `user` (`email`, `password`, `role`, `created_at`, `updated_at`) 
VALUES ('admin@example.com', '$2b$10$TWRrVU/0DdIjSO4kLoJCputozyGPz0E3mSIJ5Ns7GP/OKPTLZHGi2', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE `email` = `email`;
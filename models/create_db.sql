-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema bughouse_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bughouse_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bughouse_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `bughouse_db` ;

-- -----------------------------------------------------
-- Table `bughouse_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bughouse_db`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `username` VARCHAR(25) NOT NULL COMMENT '',
  `password_hash` CHAR(60) NOT NULL COMMENT '',
  `title` VARCHAR(2) NULL COMMENT '',
  `ratingBullet` INT NOT NULL DEFAULT 1500 COMMENT '',
  `rdBullet` INT NOT NULL DEFAULT 350 COMMENT '',
  `ratingBlitz` INT NOT NULL DEFAULT 1500 COMMENT '',
  `rdBlitz` INT NOT NULL DEFAULT 350 COMMENT '',
  `ratingClassical` INT NOT NULL DEFAULT 1500 COMMENT '',
  `rdClassical` INT NOT NULL DEFAULT 350 COMMENT '',
  PRIMARY KEY (`user_id`)  COMMENT '',
  UNIQUE INDEX `username_UNIQUE` (`username` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bughouse_db`.`games`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bughouse_db`.`games` (
  `game_id` VARCHAR(12) NOT NULL COMMENT '',
  `moves` VARCHAR(10000) NULL COMMENT '',
  `left_fen` VARCHAR(80) NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' COMMENT '',
  `right_fen` VARCHAR(80) NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' COMMENT '',
  `left_reserve_white` VARCHAR(2000) NULL COMMENT '',
  `left_reserve_black` VARCHAR(2000) NULL COMMENT '',
  `right_reserve_white` VARCHAR(2000) NULL COMMENT '',
  `right_reserve_black` VARCHAR(2000) NULL COMMENT '',
  `minutes` INT NOT NULL DEFAULT 5 COMMENT '',
  `increment` INT NOT NULL DEFAULT 5 COMMENT '',
  `rating_range` VARCHAR(9) NULL DEFAULT '0,3000' COMMENT '',
  `mode` VARCHAR(15) NOT NULL DEFAULT 'Casual' COMMENT '',
  `status` VARCHAR(25) NOT NULL DEFAULT 'open' COMMENT '',
  `timestamp` TIMESTAMP(6) NULL COMMENT '',
  `termination` VARCHAR(45) NULL COMMENT '',
  `join_random` TINYINT(1) NULL DEFAULT 1 COMMENT '',
  `fk_player1_id` INT NULL COMMENT '',
  `fk_player2_id` INT NULL COMMENT '',
  `fk_player3_id` INT NULL COMMENT '',
  `fk_player4_id` INT NULL COMMENT '',
  PRIMARY KEY (`game_id`)  COMMENT '',
  INDEX `fk_player1_id_idx` (`fk_player1_id` ASC)  COMMENT '',
  INDEX `fk_player2_id_idx` (`fk_player2_id` ASC)  COMMENT '',
  INDEX `fk_player3_id_idx` (`fk_player3_id` ASC)  COMMENT '',
  INDEX `fk_player4_id_idx` (`fk_player4_id` ASC)  COMMENT '',
  CONSTRAINT `fk_player1_id`
    FOREIGN KEY (`fk_player1_id`)
    REFERENCES `bughouse_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_player2_id`
    FOREIGN KEY (`fk_player2_id`)
    REFERENCES `bughouse_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_player3_id`
    FOREIGN KEY (`fk_player3_id`)
    REFERENCES `bughouse_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_player4_id`
    FOREIGN KEY (`fk_player4_id`)
    REFERENCES `bughouse_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE USER 'root' IDENTIFIED BY 'password';

GRANT ALL ON `bughouse_db`.* TO 'root';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

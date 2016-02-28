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
  `title` VARCHAR(2) NULL COMMENT '',
  `ratingBlitz` INT NULL DEFAULT 1200 COMMENT '',
  `ratingBullet` INT NULL DEFAULT 1200 COMMENT '',
  `ratingClassical` INT NULL DEFAULT 1200 COMMENT '',
  PRIMARY KEY (`user_id`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bughouse_db`.`games`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bughouse_db`.`games` (
  `game_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `timestamp` VARCHAR(45) NULL COMMENT '',
  `pgn` VARCHAR(5000) NULL COMMENT '',
  `time_control` VARCHAR(15) NULL COMMENT '',
  `mode` VARCHAR(15) NULL COMMENT '',
  `status` VARCHAR(25) NOT NULL DEFAULT 'open' COMMENT '',
  `game_timestamp` TIMESTAMP(6) NULL COMMENT '',
  `termination` VARCHAR(45) NULL COMMENT '',
  PRIMARY KEY (`game_id`)  COMMENT '',
  CONSTRAINT `player1`
    FOREIGN KEY (`game_id`)
    REFERENCES `bughouse_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `player2`
    FOREIGN KEY (`game_id`)
    REFERENCES `bughouse_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `player3`
    FOREIGN KEY (`game_id`)
    REFERENCES `bughouse_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `player4`
    FOREIGN KEY (`game_id`)
    REFERENCES `bughouse_db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE USER 'root' IDENTIFIED BY 'password';

GRANT ALL ON `bughouse_db`.* TO 'root';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

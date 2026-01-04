/* ============================================================
   MySQL 8+
   Goal: denormalized/flat tables for fast filtering + aggregation

   ============================================================ */

CREATE DATABASE IF NOT EXISTS reporting_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE reporting_db;

-- ============================================================
-- 0) Shared “audit fields” pattern (implemented per table)
-- createdDate/updatedDate use CURRENT_TIMESTAMP defaults
-- isActive default TRUE
-- ============================================================

-- ============================================================
-- 1) Flat User table (ApplicationUser + UserProfile)
-- Source columns:
--   ApplicationUser: username (PK), last_login
--   UserProfile: id, username, first_name, middle_name, last_name,
--               profile_completed, first_use, twitch_name,
--               last_activity_email, market_alerts
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_user_flat;
CREATE TABLE rpt_user_flat (
  -- keys
  username              VARCHAR(255) NOT NULL,  -- ApplicationUser.username (PK)
  user_profile_id       INT NULL,              -- UserProfile.id

  -- ApplicationUser
  last_login            DATETIME NULL,

  -- UserProfile
  first_name            VARCHAR(255) NULL,
  middle_name           VARCHAR(255) NULL,
  last_name             VARCHAR(255) NULL,
  profile_completed     TINYINT(1) NOT NULL DEFAULT 0,
  first_use             TINYINT(1) NOT NULL DEFAULT 0,
  twitch_name           VARCHAR(255) NULL,
  last_activity_email   DATETIME NULL,
  market_alerts         TINYINT(1) NOT NULL DEFAULT 0,

  -- AuditFields
  createdBy             VARCHAR(255) NULL,
  createdDate           DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy             VARCHAR(255) NULL,
  updatedDate           DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive              TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (username),

  KEY idx_user_last_login (last_login),
  KEY idx_user_twitch_name (twitch_name),
  KEY idx_user_profile_completed (profile_completed),
  KEY idx_user_market_alerts (market_alerts),
  KEY idx_user_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 2) StreamingPreference dimension (StreamingPreference)
-- Source columns: id, value, display_name, preferrence_type
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_streaming_preference;
CREATE TABLE rpt_streaming_preference (
  id                 INT NOT NULL,
  value              TEXT NULL,
  display_name       TEXT NULL,
  preferrence_type   VARCHAR(255) NOT NULL,

  -- AuditFields
  createdBy          VARCHAR(255) NULL,
  createdDate        DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy          VARCHAR(255) NULL,
  updatedDate        DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive           TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  KEY idx_pref_type (preferrence_type(100)),
  KEY idx_pref_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 3) Flat User Preferences (UserPreferences JOIN StreamingPreference)
-- Source columns:
--   UserPreferences: id, streaming_preference_id, username
--   StreamingPreference: value, display_name, preferrence_type
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_user_preferences_flat;
CREATE TABLE rpt_user_preferences_flat (
  id                   INT NOT NULL,           -- UserPreferences.id
  username             VARCHAR(255) NOT NULL,  -- UserPreferences.username
  streaming_preference_id INT NOT NULL,        -- UserPreferences.streaming_preference_id

  -- from StreamingPreference
  preference_value     TEXT NULL,
  preference_display_name TEXT NULL,
  preferrence_type     VARCHAR(255) NOT NULL,

  -- AuditFields
  createdBy            VARCHAR(255) NULL,
  createdDate          DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy            VARCHAR(255) NULL,
  updatedDate          DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive             TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  KEY idx_up_username (username),
  KEY idx_up_pref_id (streaming_preference_id),
  KEY idx_up_type (preferrence_type(100)),
  KEY idx_up_user_type (username, preferrence_type(100)),
  KEY idx_up_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 4) Game dimension (IGDBGame)
-- Source columns:
--   id, cover, genres, name, display_name, summary, themes, igdb_api_id
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_igdb_game;
CREATE TABLE rpt_igdb_game (
  id               INT NOT NULL,   -- IGDBGame.id
  cover            TEXT NULL,
  genres           TEXT NULL,
  name             TEXT NULL,
  display_name     TEXT NULL,
  summary          TEXT NULL,
  themes           TEXT NULL,
  igdb_api_id      INT NULL,

  -- AuditFields
  createdBy        VARCHAR(255) NULL,
  createdDate      DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy        VARCHAR(255) NULL,
  updatedDate      DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive         TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  KEY idx_game_igdb_api_id (igdb_api_id),
  KEY idx_game_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 5) Game Platforms flat (IGDBGamePlatforms)
-- Source columns: id, igdb_game_id, platform_id
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_igdb_game_platforms;
CREATE TABLE rpt_igdb_game_platforms (
  id             INT NOT NULL,
  igdb_game_id   INT NOT NULL,
  platform_id    INT NOT NULL,

  -- AuditFields
  createdBy      VARCHAR(255) NULL,
  createdDate    DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy      VARCHAR(255) NULL,
  updatedDate    DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive       TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  KEY idx_gp_game (igdb_game_id),
  KEY idx_gp_platform (platform_id),
  KEY idx_gp_game_platform (igdb_game_id, platform_id),
  KEY idx_gp_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 6) Game Platforms aggregate helper (denormalized for fast filters)
-- Derived only from IGDBGamePlatforms columns (no invented platform names)
-- ============================================================

DROP TABLE IF EXISTS rpt_igdb_game_platforms_agg;
CREATE TABLE rpt_igdb_game_platforms_agg (
  igdb_game_id    INT NOT NULL,
  platform_ids    TEXT NULL,      -- comma-separated platform_id list populated by ETL
  platform_count  INT NULL,

  -- AuditFields
  createdBy       VARCHAR(255) NULL,
  createdDate     DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy       VARCHAR(255) NULL,
  updatedDate     DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive        TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (igdb_game_id),
  KEY idx_gpa_platform_count (platform_count),
  KEY idx_gpa_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 7) User Feedback flat (IGDBGameUserFeedback JOIN IGDBGame JOIN rpt_user_flat)
-- Source columns:
--   IGDBGameUserFeedback: id, igdb_game_id, positive, comment, username, selected_preferences
--   IGDBGame: display_name/genres/themes/cover/igdb_api_id (copied for flattening)
--   UserProfile: twitch_name (copied for flattening)
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_igdb_game_user_feedback_flat;
CREATE TABLE rpt_igdb_game_user_feedback_flat (
  id                   INT NOT NULL,           -- IGDBGameUserFeedback.id
  igdb_game_id         INT NOT NULL,           -- IGDBGameUserFeedback.igdb_game_id
  username             VARCHAR(255) NOT NULL,  -- IGDBGameUserFeedback.username

  positive             TINYINT(1) NOT NULL DEFAULT 1,
  comment              TEXT NULL,
  selected_preferences TEXT NULL,

  -- flattened game fields (from IGDBGame)
  game_display_name    TEXT NULL,
  game_genres          TEXT NULL,
  game_themes          TEXT NULL,
  game_cover           TEXT NULL,
  game_igdb_api_id     INT NULL,

  -- flattened user fields (from UserProfile via rpt_user_flat)
  twitch_name          VARCHAR(255) NULL,

  -- AuditFields
  createdBy            VARCHAR(255) NULL,
  createdDate          DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy            VARCHAR(255) NULL,
  updatedDate          DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive             TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  KEY idx_fb_game (igdb_game_id),
  KEY idx_fb_user (username),
  KEY idx_fb_positive (positive),
  KEY idx_fb_user_game (username, igdb_game_id),
  KEY idx_fb_game_positive (igdb_game_id, positive),
  KEY idx_fb_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 8) User Unsaved Feedback flat (IGDBGameUserUnsaved JOIN IGDBGame JOIN rpt_user_flat)
-- Source columns:
--   IGDBGameUserUnsaved: id, igdb_game_id, comment, username,
--                        original_feedback, saved_date, selected_preferences
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_igdb_game_user_unsaved_flat;
CREATE TABLE rpt_igdb_game_user_unsaved_flat (
  id                   INT NOT NULL,          -- IGDBGameUserUnsaved.id
  igdb_game_id         INT NOT NULL,          -- IGDBGameUserUnsaved.igdb_game_id
  username             VARCHAR(255) NOT NULL, -- IGDBGameUserUnsaved.username

  comment              TEXT NULL,
  original_feedback    INT NULL,
  saved_date           DATETIME NULL,
  selected_preferences TEXT NULL,

  -- flattened game fields
  game_display_name    TEXT NULL,
  game_genres          TEXT NULL,
  game_themes          TEXT NULL,
  game_cover           TEXT NULL,
  game_igdb_api_id     INT NULL,

  -- flattened user fields
  twitch_name          VARCHAR(255) NULL,

  -- AuditFields
  createdBy            VARCHAR(255) NULL,
  createdDate          DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy            VARCHAR(255) NULL,
  updatedDate          DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive             TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  KEY idx_uns_game (igdb_game_id),
  KEY idx_uns_user (username),
  KEY idx_uns_saved_date (saved_date),
  KEY idx_uns_user_game (username, igdb_game_id),
  KEY idx_uns_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 9) Twitch Game Recommendation flat
-- Source columns:
--   TwitchGameRecommendation: id, igdb_game_id, stat_type, recommendation_reason,
--                             username, batch_number, is_queued, recommendation_type, hidden
-- + flattened game + user fields
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_twitch_game_recommendation_flat;
CREATE TABLE rpt_twitch_game_recommendation_flat (
  id                   INT NOT NULL,           -- TwitchGameRecommendation.id
  igdb_game_id         INT NOT NULL,           -- TwitchGameRecommendation.igdb_game_id
  username             VARCHAR(255) NOT NULL,  -- TwitchGameRecommendation.username

  stat_type            VARCHAR(200) NOT NULL,  -- max length 200 per Excel
  recommendation_reason TEXT NULL,
  batch_number         VARCHAR(255) NOT NULL,
  is_queued            TINYINT(1) NOT NULL DEFAULT 0,
  recommendation_type  VARCHAR(200) NOT NULL,  -- max length 200 per Excel
  hidden               TINYINT(1) NOT NULL DEFAULT 0,

  -- flattened game fields
  game_display_name    TEXT NULL,
  game_genres          TEXT NULL,
  game_themes          TEXT NULL,
  game_cover           TEXT NULL,
  game_igdb_api_id     INT NULL,

  -- flattened user fields
  twitch_name          VARCHAR(255) NULL,

  -- AuditFields
  createdBy            VARCHAR(255) NULL,
  createdDate          DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy            VARCHAR(255) NULL,
  updatedDate          DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive             TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),

  KEY idx_rec_game (igdb_game_id),
  KEY idx_rec_user (username),
  KEY idx_rec_batch (batch_number),
  KEY idx_rec_stat_type (stat_type),
  KEY idx_rec_type (recommendation_type),
  KEY idx_rec_is_queued (is_queued),
  KEY idx_rec_hidden (hidden),

  -- common API filters
  KEY idx_rec_user_queue_hidden (username, is_queued, hidden),
  KEY idx_rec_batch_type (batch_number, recommendation_type),
  KEY idx_rec_updatedDate (updatedDate)
) ENGINE=InnoDB;

-- ============================================================
-- 10) UserBoosts flat (UserBoosts JOIN rpt_user_flat)
-- Source columns:
--   UserBoosts: id, username, booster_type (max 200), booster_units,
--              booster_units_consumed, expires_on, boost_triggered
-- + flattened user twitch_name
-- + AuditFields
-- ============================================================

DROP TABLE IF EXISTS rpt_user_boosts_flat;
CREATE TABLE rpt_user_boosts_flat (
  id                    INT NOT NULL,           -- UserBoosts.id
  username              VARCHAR(255) NOT NULL,  -- UserBoosts.username

  booster_type          VARCHAR(200) NOT NULL,
  booster_units         DOUBLE NOT NULL,
  booster_units_consumed DOUBLE NOT NULL,
  expires_on            DATETIME NULL,
  boost_triggered       TINYINT(1) NOT NULL DEFAULT 0,

  -- flattened user field
  twitch_name           VARCHAR(255) NULL,

  -- AuditFields
  createdBy             VARCHAR(255) NULL,
  createdDate           DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy             VARCHAR(255) NULL,
  updatedDate           DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isActive              TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),

  KEY idx_boost_user (username),
  KEY idx_boost_type (booster_type),
  KEY idx_boost_expires (expires_on),
  KEY idx_boost_triggered (boost_triggered),
  KEY idx_boost_user_type (username, booster_type),
  KEY idx_boost_updatedDate (updatedDate)
) ENGINE=InnoDB;

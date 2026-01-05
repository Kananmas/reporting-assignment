import { Sequelize, QueryTypes } from "sequelize";
import {faker} from '@faker-js/faker';
import { injectEnv } from "./utils/inject-env.utils.js";


// injecting env before accessing db
injectEnv();

// Database configuration
const sequelize = new Sequelize('reporting_db', process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Set to console.log for debugging
  dialectOptions: {
    multipleStatements: true
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Configuration
const CONFIG = {
  NUM_USERS: 3000,         
  NUM_GAMES: 1500,           
  NUM_PREFERENCES: 8,
  MAX_PREFERENCES_PER_USER: 5, 
  MAX_PLATFORMS_PER_GAME: 4,  
  FEEDBACK_RATE: 0.5,        
  RECOMMENDATION_RATE: 0.6,  
  BOOST_RATE: 0.3,           
  MAX_FEEDBACK_PER_USER: 8,   
  MAX_RECOMMENDATIONS_PER_USER: 10,
  MAX_BOOSTS_PER_USER: 4,    
  BATCH_SIZE: 500,   
  START_DATE: new Date('2022-01-01'),
  END_DATE: new Date()
};

// Data generation helpers
class DataGenerator {
  static generateUsername() {
    return `${faker.internet.username().toLowerCase().replace(/[^a-z0-9_]/g, '_')}_${faker.number.int({ min: 1, max: 999 })}`;
  }

  static generateTwitchName(username) {
    return faker.datatype.boolean(0.7) ? `${username}_twitch` : null;
  }

  static generateEmail(username) {
    return `${username}@${faker.internet.domainName()}`;
  }

  static generateDate(start, end) {
    return faker.date.between({ from: start, to: end });
  }

  static generatePlatformIds(maxCount) {
    const count = faker.number.int({ min: 1, max: maxCount });
    const platforms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Common platform IDs
    return faker.helpers.arrayElements(platforms, count).sort((a, b) => a - b);
  }

  static generateCSVPlatformIds(platformIds) {
    return platformIds.join(',');
  }

  static generatePreferences(availablePrefs, maxCount) {
    const count = faker.number.int({ min: 0, max: maxCount });
    return faker.helpers.arrayElements(availablePrefs, count);
  }

  static generateGameGenres() {
    const genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Puzzle', 'Horror', 'Indie', 'Arcade'];
    return faker.helpers.arrayElements(genres, faker.number.int({ min: 1, max: 3 })).join('|');
  }

  static generateGameThemes() {
    const themes = ['Fantasy', 'Sci-Fi', 'Historical', 'Modern', 'War', 'Comedy', 'Drama', 'Romance', 'Mystery', 'Survival'];
    return faker.helpers.arrayElements(themes, faker.number.int({ min: 1, max: 2 })).join('|');
  }
}

// Main population class
class ReportingDataPopulator {
  constructor() {
    this.generatedData = {
      users: [],
      streamingPreferences: [],
      userPreferences: [],
      games: [],
      gamePlatforms: [],
      feedback: [],
      unsavedFeedback: [],
      recommendations: [],
      boosts: []
    };
  }

  async connect() {
    try {
      await sequelize.authenticate();
      console.log('✅ Connected to MySQL database');
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      throw error;
    }
  }

  async clearExistingData() {
    console.log('🗑️  Clearing existing data...');
    
    // Turn off foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { type: QueryTypes.RAW });
    
    const tables = [
      'rpt_user_boosts_flat',
      'rpt_twitch_game_recommendation_flat',
      'rpt_igdb_game_user_unsaved_flat',
      'rpt_igdb_game_user_feedback_flat',
      'rpt_igdb_game_platforms_agg',
      'rpt_igdb_game_platforms',
      'rpt_igdb_game',
      'rpt_user_preferences_flat',
      'rpt_streaming_preference',
      'rpt_user_flat'
    ];
    
    for (const table of tables) {
      try {
        await sequelize.query(`TRUNCATE TABLE ${table}`, { type: QueryTypes.RAW });
        console.log(`   Cleared: ${table}`);
      } catch (error) {
        console.log(`   Skipped (might not exist): ${table}`);
      }
    }
    
    // Turn foreign key checks back on
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { type: QueryTypes.RAW });
    console.log('✅ All tables cleared\n');
  }

  generateStreamingPreferences() {
    console.log('🎮 Generating streaming preferences...');
    
    const preferenceTypes = [
      'video_quality',
      'stream_schedule', 
      'content_type',
      'interaction_level',
      'platform',
      'game_genre',
      'stream_length',
      'chat_style'
    ];
    
    this.generatedData.streamingPreferences = preferenceTypes.map((type, index) => ({
      id: index + 1,
      value: faker.lorem.words(3),
      display_name: `${type.replace('_', ' ').toUpperCase()} Preference`,
      preferrence_type: type,
      createdBy: 'system',
      createdDate: CONFIG.START_DATE,
      updatedBy: 'system',
      updatedDate: CONFIG.START_DATE,
      isActive: 1
    }));
    
    console.log(`✅ Generated ${this.generatedData.streamingPreferences.length} streaming preferences\n`);
  }

  async insertStreamingPreferences() {
    const preferences = this.generatedData.streamingPreferences;
    
    for (let i = 0; i < preferences.length; i += CONFIG.BATCH_SIZE) {
      const batch = preferences.slice(i, i + CONFIG.BATCH_SIZE);
      const values = batch.map(p => `(
        ${p.id},
        ${sequelize.escape(p.value)},
        ${sequelize.escape(p.display_name)},
        ${sequelize.escape(p.preferrence_type)},
        ${sequelize.escape(p.createdBy)},
        ${sequelize.escape(p.createdDate)},
        ${sequelize.escape(p.updatedBy)},
        ${sequelize.escape(p.updatedDate)},
        ${p.isActive}
      )`).join(',');
      
      const sql = `
        INSERT INTO rpt_streaming_preference 
        (id, value, display_name, preferrence_type, createdBy, createdDate, updatedBy, updatedDate, isActive)
        VALUES ${values}
        ON DUPLICATE KEY UPDATE updatedDate = VALUES(updatedDate)
      `;
      
      await sequelize.query(sql, { type: QueryTypes.INSERT });
    }
    
    console.log(`✅ Inserted ${preferences.length} streaming preferences`);
  }

  generateUsers() {
    console.log('👤 Generating users...');
    
    for (let i = 1; i <= CONFIG.NUM_USERS; i++) {
      const username = DataGenerator.generateUsername();
      const createdDate = DataGenerator.generateDate(CONFIG.START_DATE, CONFIG.END_DATE);
      const updatedDate = faker.date.between({ from: createdDate, to: CONFIG.END_DATE });
      
      const user = {
        username,
        user_profile_id: i,
        last_login: faker.datatype.boolean(0.7) ? DataGenerator.generateDate(createdDate, CONFIG.END_DATE) : null,
        first_name: faker.datatype.boolean(0.8) ? faker.person.firstName() : null,
        middle_name: faker.datatype.boolean(0.2) ? faker.person.middleName() : null,
        last_name: faker.datatype.boolean(0.8) ? faker.person.lastName() : null,
        profile_completed: faker.datatype.boolean(0.6) ? 1 : 0,
        first_use: faker.datatype.boolean(0.3) ? 1 : 0,
        twitch_name: DataGenerator.generateTwitchName(username),
        last_activity_email: faker.datatype.boolean(0.5) ? DataGenerator.generateDate(createdDate, CONFIG.END_DATE) : null,
        market_alerts: faker.datatype.boolean(0.4) ? 1 : 0,
        createdBy: 'system',
        createdDate,
        updatedBy: 'system',
        updatedDate,
        isActive: faker.datatype.boolean(0.9) ? 1 : 0
      };
      
      this.generatedData.users.push(user);
      
      // Generate preferences for this user
      this.generateUserPreferences(username, i);
      
      // Generate feedback for this user (if applicable)
      if (faker.number.float({ min: 0, max: 1 }) < CONFIG.FEEDBACK_RATE) {
        this.generateUserFeedback(username);
      }
      
      // Generate recommendations for this user (if applicable)
      if (faker.number.float({ min: 0, max: 1 }) < CONFIG.RECOMMENDATION_RATE) {
        this.generateRecommendations(username);
      }
      
      // Generate boosts for this user (if applicable)
      if (faker.number.float({ min: 0, max: 1 }) < CONFIG.BOOST_RATE) {
        this.generateBoosts(username);
      }
      
      if (i % 100 === 0) {
        process.stdout.write(`   Generated ${i} users\r`);
      }
    }
    
    console.log(`\n✅ Generated ${this.generatedData.users.length} users with related data\n`);
  }

  generateUserPreferences(username, userId) {
    const numPrefs = faker.number.int({ min: 0, max: CONFIG.MAX_PREFERENCES_PER_USER });
    const availablePrefs = this.generatedData.streamingPreferences;
    
    for (let i = 0; i < numPrefs; i++) {
      const pref = faker.helpers.arrayElement(availablePrefs);
      const createdDate = DataGenerator.generateDate(CONFIG.START_DATE, CONFIG.END_DATE);
      
      this.generatedData.userPreferences.push({
        id: this.generatedData.userPreferences.length + 1,
        username,
        streaming_preference_id: pref.id,
        preference_value: pref.value,
        preference_display_name: pref.display_name,
        preferrence_type: pref.preferrence_type,
        createdBy: 'system',
        createdDate,
        updatedBy: 'system',
        updatedDate: createdDate,
        isActive: 1
      });
    }
  }

  generateGames() {
    console.log('🎮 Generating games...');
    
    for (let i = 1; i <= CONFIG.NUM_GAMES; i++) {
      const createdDate = DataGenerator.generateDate(CONFIG.START_DATE, CONFIG.END_DATE);
      
      const game = {
        id: i,
        cover: `https://images.igdb.com/igdb/image/upload/t_cover_big/${faker.string.alphanumeric(10)}.jpg`,
        genres: DataGenerator.generateGameGenres(),
        name: faker.commerce.productName(),
        display_name: `${faker.commerce.productName()} ${faker.word.adjective()}`,
        summary: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
        themes: DataGenerator.generateGameThemes(),
        igdb_api_id: faker.number.int({ min: 1000, max: 99999 }),
        createdBy: 'system',
        createdDate,
        updatedBy: 'system',
        updatedDate: faker.date.between({ from: createdDate, to: CONFIG.END_DATE }),
        isActive: 1
      };
      
      this.generatedData.games.push(game);
      
      // Generate platforms for this game
      this.generateGamePlatforms(i);
      
      if (i % 100 === 0) {
        process.stdout.write(`   Generated ${i} games\r`);
      }
    }
    
    console.log(`\n✅ Generated ${this.generatedData.games.length} games\n`);
  }

  generateGamePlatforms(gameId) {
    const platformIds = DataGenerator.generatePlatformIds(CONFIG.MAX_PLATFORMS_PER_GAME);
    
    platformIds.forEach((platformId, index) => {
      this.generatedData.gamePlatforms.push({
        id: this.generatedData.gamePlatforms.length + 1,
        igdb_game_id: gameId,
        platform_id: platformId,
        createdBy: 'system',
        createdDate: CONFIG.START_DATE,
        updatedBy: 'system',
        updatedDate: CONFIG.START_DATE,
        isActive: 1
      });
    });
    
    // Create aggregated platform data
    this.generatedData.gamePlatformsAgg = this.generatedData.gamePlatformsAgg || [];
    this.generatedData.gamePlatformsAgg.push({
      igdb_game_id: gameId,
      platform_ids: DataGenerator.generateCSVPlatformIds(platformIds),
      platform_count: platformIds.length,
      createdBy: 'system',
      createdDate: CONFIG.START_DATE,
      updatedBy: 'system',
      updatedDate: CONFIG.START_DATE,
      isActive: 1
    });
  }

  generateUserFeedback(username) {
    const numFeedbacks = faker.number.int({ min: 1, max: 5 });
    const availableGames = this.generatedData.games.slice(0, 100); // Limit to first 100 games for realism
    
    for (let i = 0; i < numFeedbacks; i++) {
      const game = faker.helpers.arrayElement(availableGames);
      const createdDate = DataGenerator.generateDate(CONFIG.START_DATE, CONFIG.END_DATE);
      const user = this.generatedData.users.find(u => u.username === username);
      
      this.generatedData.feedback.push({
        id: this.generatedData.feedback.length + 1,
        igdb_game_id: game.id,
        username,
        positive: faker.datatype.boolean(0.7) ? 1 : 0,
        comment: faker.datatype.boolean(0.5) ? faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })) : null,
        selected_preferences: JSON.stringify(DataGenerator.generatePreferences(
          this.generatedData.streamingPreferences.slice(0, 3),
          2
        )),
        game_display_name: game.display_name,
        game_genres: game.genres,
        game_themes: game.themes,
        game_cover: game.cover,
        game_igdb_api_id: game.igdb_api_id,
        twitch_name: user?.twitch_name || null,
        createdBy: 'system',
        createdDate,
        updatedBy: 'system',
        updatedDate: createdDate,
        isActive: 1
      });
      
      // Generate unsaved feedback for some of these
      if (faker.datatype.boolean(0.2)) {
        this.generateUnsavedFeedback(username, game, this.generatedData.feedback.length);
      }
    }
  }

  generateUnsavedFeedback(username, game, feedbackId) {
    const createdDate = DataGenerator.generateDate(CONFIG.START_DATE, CONFIG.END_DATE);
    const user = this.generatedData.users.find(u => u.username === username);
    
    this.generatedData.unsavedFeedback.push({
      id: this.generatedData.unsavedFeedback.length + 1,
      igdb_game_id: game.id,
      username,
      comment: faker.lorem.sentences(faker.number.int({ min: 1, max: 2 })),
      original_feedback: feedbackId,
      saved_date: faker.datatype.boolean(0.3) ? DataGenerator.generateDate(createdDate, CONFIG.END_DATE) : null,
      selected_preferences: JSON.stringify(DataGenerator.generatePreferences(
        this.generatedData.streamingPreferences.slice(0, 3),
        2
      )),
      game_display_name: game.display_name,
      game_genres: game.genres,
      game_themes: game.themes,
      game_cover: game.cover,
      game_igdb_api_id: game.igdb_api_id,
      twitch_name: user?.twitch_name || null,
      createdBy: 'system',
      createdDate,
      updatedBy: 'system',
      updatedDate: createdDate,
      isActive: 1
    });
  }

  generateRecommendations(username) {
    const numRecs = faker.number.int({ min: 1, max: 8 });
    const availableGames = this.generatedData.games.slice(0, 150);
    const batchNumber = `batch_${faker.number.int({ min: 1, max: 10 })}`;
    const user = this.generatedData.users.find(u => u.username === username);
    
    const statTypes = ['popularity', 'engagement', 'similarity', 'trending', 'personalized'];
    const recTypes = ['weekly', 'featured', 'new_release', 'followed_streamer', 'similar_taste'];
    
    for (let i = 0; i < numRecs; i++) {
      const game = faker.helpers.arrayElement(availableGames);
      const createdDate = DataGenerator.generateDate(CONFIG.START_DATE, CONFIG.END_DATE);
      
      this.generatedData.recommendations.push({
        id: this.generatedData.recommendations.length + 1,
        igdb_game_id: game.id,
        username,
        stat_type: faker.helpers.arrayElement(statTypes),
        recommendation_reason: faker.lorem.sentence(),
        batch_number: batchNumber,
        is_queued: faker.datatype.boolean(0.3) ? 1 : 0,
        recommendation_type: faker.helpers.arrayElement(recTypes),
        hidden: faker.datatype.boolean(0.1) ? 1 : 0,
        game_display_name: game.display_name,
        game_genres: game.genres,
        game_themes: game.themes,
        game_cover: game.cover,
        game_igdb_api_id: game.igdb_api_id,
        twitch_name: user?.twitch_name || null,
        createdBy: 'system',
        createdDate,
        updatedBy: 'system',
        updatedDate: createdDate,
        isActive: 1
      });
    }
  }

  generateBoosts(username) {
    const numBoosts = faker.number.int({ min: 1, max: 3 });
    const user = this.generatedData.users.find(u => u.username === username);
    const boostTypes = ['view_boost', 'discovery_boost', 'engagement_boost', 'priority_boost'];
    
    for (let i = 0; i < numBoosts; i++) {
      const createdDate = DataGenerator.generateDate(CONFIG.START_DATE, CONFIG.END_DATE);
      
      this.generatedData.boosts.push({
        id: this.generatedData.boosts.length + 1,
        username,
        booster_type: faker.helpers.arrayElement(boostTypes),
        booster_units: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
        booster_units_consumed: faker.number.float({ min: 0, max: 50, fractionDigits: 2 }),
        expires_on: faker.date.future({ years: 1 }),
        boost_triggered: faker.datatype.boolean(0.4) ? 1 : 0,
        twitch_name: user?.twitch_name || null,
        createdBy: 'system',
        createdDate,
        updatedBy: 'system',
        updatedDate: createdDate,
        isActive: 1
      });
    }
  }

  async insertDataInBatches() {
    console.log('💾 Inserting data into database...\n');
    
    // Insert in order to respect foreign key dependencies
    await this.insertTable('users', 'rpt_user_flat');
    await this.insertTable('streamingPreferences', 'rpt_streaming_preference');
    await this.insertTable('userPreferences', 'rpt_user_preferences_flat');
    await this.insertTable('games', 'rpt_igdb_game');
    await this.insertTable('gamePlatforms', 'rpt_igdb_game_platforms');
    await this.insertTable('gamePlatformsAgg', 'rpt_igdb_game_platforms_agg');
    await this.insertTable('feedback', 'rpt_igdb_game_user_feedback_flat');
    await this.insertTable('unsavedFeedback', 'rpt_igdb_game_user_unsaved_flat');
    await this.insertTable('recommendations', 'rpt_twitch_game_recommendation_flat');
    await this.insertTable('boosts', 'rpt_user_boosts_flat');
    
    console.log('\n✅ All data inserted successfully!');
  }

  async insertTable(dataKey, tableName) {
    if (!this.generatedData[dataKey] || this.generatedData[dataKey].length === 0) {
      console.log(`⏭️  Skipping ${tableName} (no data)`);
      return;
    }
    
    const data = this.generatedData[dataKey];
    console.log(`📥 Inserting ${data.length} rows into ${tableName}...`);
    
    // Get column names from first object
    const columns = Object.keys(data[0]);
    
    for (let i = 0; i < data.length; i += CONFIG.BATCH_SIZE) {
      const batch = data.slice(i, i + CONFIG.BATCH_SIZE);
      
      const values = batch.map(row => 
        columns.map(col => {
          const value = row[col];
          if (value === null || value === undefined) return 'NULL';
          if (typeof value === 'number') return value;
          if (typeof value === 'boolean') return value ? 1 : 0;
          if (value instanceof Date) return sequelize.escape(value);
          return sequelize.escape(value);
        }).join(',')
      ).map(rowValues => `(${rowValues})`).join(',');
      
      const sql = `
        INSERT INTO ${tableName} (${columns.join(', ')})
        VALUES ${values}
        ON DUPLICATE KEY UPDATE updatedDate = VALUES(updatedDate)
      `;
      
      try {
        await sequelize.query(sql, { type: QueryTypes.INSERT });
        process.stdout.write(`   Inserted ${Math.min(i + CONFIG.BATCH_SIZE, data.length)} of ${data.length}\r`);
      } catch (error) {
        console.error(`\n❌ Error inserting into ${tableName}:`, error.message);
        // For debugging, log the first problematic row
        if (batch[0]) {
          console.error('Sample row:', JSON.stringify(batch[0], null, 2));
        }
        throw error;
      }
    }
    
    console.log(`\n✅ Inserted ${data.length} rows into ${tableName}`);
  }

  async run() {
    try {
      console.log('🚀 Starting reporting database population...\n');
      
      await this.connect();
      await this.clearExistingData();
      
      // Generate data (in memory first)
      this.generateStreamingPreferences();
      this.generateGames();
      this.generateUsers();
      
      // Insert data
      await this.insertDataInBatches();
      
      // Create some summary indexes/views (optional)
      await this.createSummaryViews();
      
      console.log('\n🎉 Population complete!');
      this.printStatistics();
      
    } catch (error) {
      console.error('❌ Population failed:', error);
      throw error;
    } finally {
      await sequelize.close();
      console.log('\n🔌 Database connection closed');
    }
  }

  async createSummaryViews() {
    console.log('\n🔍 Creating summary views...');
    
    const views = [
      `CREATE OR REPLACE VIEW vw_user_summary AS
       SELECT 
         COUNT(*) as total_users,
         SUM(profile_completed) as profiles_completed,
         SUM(market_alerts) as market_alerts_enabled,
         AVG(TIMESTAMPDIFF(DAY, createdDate, COALESCE(last_login, NOW()))) as avg_days_since_login
       FROM rpt_user_flat
       WHERE isActive = 1`,
       
      `CREATE OR REPLACE VIEW vw_game_feedback_summary AS
       SELECT 
         igdb_game_id,
         game_display_name,
         COUNT(*) as total_feedback,
         SUM(positive) as positive_feedback,
         AVG(positive) * 100 as positive_percentage
       FROM rpt_igdb_game_user_feedback_flat
       WHERE isActive = 1
       GROUP BY igdb_game_id, game_display_name
       ORDER BY total_feedback DESC`
    ];
    
    for (const viewSQL of views) {
      try {
        await sequelize.query(viewSQL, { type: QueryTypes.RAW });
      } catch (error) {
        console.log(`   Note: View creation skipped (might already exist): ${error.message}`);
      }
    }
    
    console.log('✅ Summary views created');
  }

  printStatistics() {
    console.log('\n📊 Data Generation Statistics:');
    console.log('='.repeat(40));
    console.log(`👤 Users: ${this.generatedData.users.length}`);
    console.log(`🎮 Games: ${this.generatedData.games.length}`);
    console.log(`⚙️  Streaming Preferences: ${this.generatedData.streamingPreferences.length}`);
    console.log(`⭐ User Preferences: ${this.generatedData.userPreferences.length}`);
    console.log(`🎯 Game Platforms: ${this.generatedData.gamePlatforms.length}`);
    console.log(`💬 Feedback Entries: ${this.generatedData.feedback.length}`);
    console.log(`📝 Unsaved Feedback: ${this.generatedData.unsavedFeedback.length}`);
    console.log(`🎪 Recommendations: ${this.generatedData.recommendations.length}`);
    console.log(`🚀 Boosts: ${this.generatedData.boosts.length}`);
    console.log('='.repeat(40));
    
    // Active users percentage
    const activeUsers = this.generatedData.users.filter(u => u.isActive).length;
    console.log(`📈 Active Users: ${activeUsers} (${((activeUsers/this.generatedData.users.length)*100).toFixed(1)}%)`);
    
    // Average feedback per user
    const avgFeedback = (this.generatedData.feedback.length / this.generatedData.users.length).toFixed(2);
    console.log(`📊 Average feedback per user: ${avgFeedback}`);
  }
}

// Command line execution
async function main() {
  const populator = new ReportingDataPopulator();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node populate-reporting.js [options]

Options:
  --small          Generate smaller dataset (100 users, 50 games)
  --medium         Generate medium dataset (500 users, 250 games)
  --large          Generate large dataset (5000 users, 1000 games)
  --clear-only     Only clear existing data, don't populate
  --help, -h       Show this help message
    `);
    process.exit(0);
  }
  
  // Adjust configuration based on arguments
  if (args.includes('--small')) {
    CONFIG.NUM_USERS = 100;
    CONFIG.NUM_GAMES = 50;
    CONFIG.BATCH_SIZE = 50;
  } else if (args.includes('--medium')) {
    CONFIG.NUM_USERS = 500;
    CONFIG.NUM_GAMES = 250;
  } else if (args.includes('--large')) {
    CONFIG.NUM_USERS = 5000;
    CONFIG.NUM_GAMES = 1000;
    CONFIG.BATCH_SIZE = 500;
  }
  
  if (args.includes('--clear-only')) {
    await populator.connect();
    await populator.clearExistingData();
    await sequelize.close();
    console.log('✅ Only clearing completed');
    process.exit(0);
  }
  
  await populator.run();
}

// Run if called directly
// if (require.main === module) {
//   main().catch(error => {
//     console.error('💥 Fatal error:', error);
//     process.exit(1);
//   });
// }

export default { ReportingDataPopulator, DataGenerator, CONFIG };
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Policy = require('./models/Policy');
const User = require('./models/User');
const RiskZone = require('./models/RiskZone');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigshield_db';
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
};

const importData = async () => {
  try {
    await connectDB();
    
    await Policy.deleteMany();
    await User.deleteMany();
    await RiskZone.deleteMany();

    // Generate Risk Zones (Chennai)
    const zones = [
        { name: 'T. Nagar', rainRisk: 40, trafficRisk: 85, aqiRisk: 60, pricingMultiplier: 1.1 },
        { name: 'Velachery', rainRisk: 90, trafficRisk: 70, aqiRisk: 30, pricingMultiplier: 1.3 },
        { name: 'Adyar', rainRisk: 30, trafficRisk: 60, aqiRisk: 35, pricingMultiplier: 1.0 },
    ];
    await RiskZone.insertMany(zones);

    // Generate Policies
    const createdPolicies = await Policy.insertMany([
      { name: 'Basic Plan', weeklyPremium: 39, maxPayout: 300, coveredDisruptions: ['Heavy Rain'] },
      { name: 'Standard Plan', weeklyPremium: 59, maxPayout: 600, coveredDisruptions: ['Heavy Rain', 'Extreme Heat', 'Traffic Gridlock'] },
      { name: 'Premium Plan', weeklyPremium: 89, maxPayout: 1000, coveredDisruptions: ['Heavy Rain', 'Extreme Heat', 'Traffic Gridlock', 'High Pollution', 'Local Shutdown'] }
    ]);

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    await User.create({
        name: 'Super Admin',
        email: 'admin@gigshield.ai',
        password: adminPassword,
        role: 'admin'
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // Option to destroy data
} else {
  importData();
}

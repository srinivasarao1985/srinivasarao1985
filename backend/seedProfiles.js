const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

const dummyProfiles = [
  {
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@matrimonial.com",
    password: "Password123",
    phone: "9876543210",
    gender: "female",
    dateOfBirth: new Date("1998-05-15"),
    religion: "Hindu",
    caste: "Brahmin",
    location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    bio: "Software engineer with passion for travel and reading. Looking for someone honest and caring.",
    occupation: "Software Engineer",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/women/1.jpg",
      publicId: "randomuser_women_1"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/women/1.jpg", publicId: "randomuser_women_1" },
      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", publicId: "unsplash_woman_1" },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", publicId: "unsplash_woman_2" },
    ]
  },
  {
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@matrimonial.com",
    password: "Password123",
    phone: "9876543211",
    gender: "male",
    dateOfBirth: new Date("1996-08-22"),
    religion: "Hindu",
    caste: "Kshatriya",
    location: { city: "Delhi", state: "Delhi", country: "India" },
    bio: "Business owner, love sports and cooking. Seeking genuine connection.",
    occupation: "Business Owner",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/men/1.jpg",
      publicId: "randomuser_men_1"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/men/1.jpg", publicId: "randomuser_men_1" },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", publicId: "unsplash_man_1" },
      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", publicId: "unsplash_man_2" },
    ]
  },
  {
    firstName: "Anjali",
    lastName: "Patel",
    email: "anjali.patel@matrimonial.com",
    password: "Password123",
    phone: "9876543212",
    gender: "female",
    dateOfBirth: new Date("1999-03-10"),
    religion: "Hindu",
    caste: "Patel",
    location: { city: "Ahmedabad", state: "Gujarat", country: "India" },
    bio: "Doctor by profession, love music and yoga. Looking for understanding partner.",
    occupation: "Doctor",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/women/2.jpg",
      publicId: "randomuser_women_2"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/women/2.jpg", publicId: "randomuser_women_2" },
      { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", publicId: "unsplash_woman_3" },
      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", publicId: "unsplash_woman_4" },
    ]
  },
  {
    firstName: "Arjun",
    lastName: "Singh",
    email: "arjun.singh@matrimonial.com",
    password: "Password123",
    phone: "9876543213",
    gender: "male",
    dateOfBirth: new Date("1994-12-05"),
    religion: "Sikh",
    caste: "Singh",
    location: { city: "Chandigarh", state: "Chandigarh", country: "India" },
    bio: "Architect with love for hiking and photography. Seeking soul mate.",
    occupation: "Architect",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/men/2.jpg",
      publicId: "randomuser_men_2"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/men/2.jpg", publicId: "randomuser_men_2" },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", publicId: "unsplash_man_3" },
      { url: "https://images.unsplash.com/photo-1523419409543-a585c8acb144?w=400", publicId: "unsplash_man_4" },
    ]
  },
  {
    firstName: "Neha",
    lastName: "Gupta",
    email: "neha.gupta@matrimonial.com",
    password: "Password123",
    phone: "9876543214",
    gender: "female",
    dateOfBirth: new Date("1997-07-20"),
    religion: "Hindu",
    caste: "Baniya",
    location: { city: "Bangalore", state: "Karnataka", country: "India" },
    bio: "Marketing executive, foodie, and adventure lover. Looking for my best friend.",
    occupation: "Marketing Executive",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/women/3.jpg",
      publicId: "randomuser_women_3"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/women/3.jpg", publicId: "randomuser_women_3" },
      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", publicId: "unsplash_woman_5" },
      { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", publicId: "unsplash_woman_6" },
    ]
  },
  {
    firstName: "Vikram",
    lastName: "Reddy",
    email: "vikram.reddy@matrimonial.com",
    password: "Password123",
    phone: "9876543215",
    gender: "male",
    dateOfBirth: new Date("1995-11-30"),
    religion: "Hindu",
    caste: "Reddy",
    location: { city: "Hyderabad", state: "Telangana", country: "India" },
    bio: "IT consultant, love movies and fitness. Seeking a companion for life.",
    occupation: "IT Consultant",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/men/3.jpg",
      publicId: "randomuser_men_3"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/men/3.jpg", publicId: "randomuser_men_3" },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", publicId: "unsplash_man_5" },
      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", publicId: "unsplash_man_6" },
    ]
  },
  {
    firstName: "Divya",
    lastName: "Nair",
    email: "divya.nair@matrimonial.com",
    password: "Password123",
    phone: "9876543216",
    gender: "female",
    dateOfBirth: new Date("1998-02-14"),
    religion: "Christian",
    caste: "Nair",
    location: { city: "Kochi", state: "Kerala", country: "India" },
    bio: "Journalist and book lover, seeking intellectual conversations and love.",
    occupation: "Journalist",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/women/4.jpg",
      publicId: "randomuser_women_4"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/women/4.jpg", publicId: "randomuser_women_4" },
      { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", publicId: "unsplash_woman_7" },
      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", publicId: "unsplash_woman_8" },
    ]
  },
  {
    firstName: "Aditya",
    lastName: "Mishra",
    email: "aditya.mishra@matrimonial.com",
    password: "Password123",
    phone: "9876543217",
    gender: "male",
    dateOfBirth: new Date("1993-09-18"),
    religion: "Hindu",
    caste: "Brahmin",
    location: { city: "Pune", state: "Maharashtra", country: "India" },
    bio: "Teacher and musician, looking for someone who shares my passion for education and arts.",
    occupation: "Teacher",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/men/4.jpg",
      publicId: "randomuser_men_4"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/men/4.jpg", publicId: "randomuser_men_4" },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", publicId: "unsplash_man_7" },
      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", publicId: "unsplash_man_8" },
    ]
  },
  {
    firstName: "Sweetie",
    lastName: "Singh",
    email: "sweetie.singh@matrimonial.com",
    password: "Password123",
    phone: "9876543218",
    gender: "female",
    dateOfBirth: new Date("1999-06-25"),
    religion: "Sikh",
    caste: "Singh",
    location: { city: "Ludhiana", state: "Punjab", country: "India" },
    bio: "Fashion designer with entrepreneurial spirit. Seeking ambitious and caring partner.",
    occupation: "Fashion Designer",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/women/5.jpg",
      publicId: "randomuser_women_5"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/women/5.jpg", publicId: "randomuser_women_5" },
      { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", publicId: "unsplash_woman_9" },
      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", publicId: "unsplash_woman_10" },
    ]
  },
  {
    firstName: "Rohan",
    lastName: "Pandey",
    email: "rohan.pandey@matrimonial.com",
    password: "Password123",
    phone: "9876543219",
    gender: "male",
    dateOfBirth: new Date("1996-04-08"),
    religion: "Hindu",
    caste: "Brahmin",
    location: { city: "Lucknow", state: "Uttar Pradesh", country: "India" },
    bio: "Entrepreneur in tech startup, fitness enthusiast. Looking for genuine connection.",
    occupation: "Entrepreneur",
    profilePicture: { 
      url: "https://randomuser.me/api/portraits/men/5.jpg",
      publicId: "randomuser_men_5"
    },
    photos: [
      { url: "https://randomuser.me/api/portraits/men/5.jpg", publicId: "randomuser_men_5" },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", publicId: "unsplash_man_9" },
      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", publicId: "unsplash_man_10" },
    ]
  },
];

const seedProfiles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing profiles
    await User.deleteMany({});
    console.log('Cleared existing profiles');

    // Hash passwords and create profiles
    for (let profile of dummyProfiles) {
      const salt = await bcrypt.genSalt(10);
      profile.password = await bcrypt.hash(profile.password, salt);
    }

    // Insert profiles
    const createdProfiles = await User.insertMany(dummyProfiles);
    console.log(`✅ Successfully created ${createdProfiles.length} dummy profiles with real photos!`);

    // Display profile info
    createdProfiles.forEach(profile => {
      console.log(`  • ${profile.firstName} ${profile.lastName} - ${profile.photos.length} photos`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding profiles:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedProfiles();
    occupation: "Marketing Executive",
    profilePicture: { url: "https://via.placeholder.com/300?text=Neha" },
  },
  {
    firstName: "Vikram",
    lastName: "Reddy",
    email: "vikram.reddy@matrimonial.com",
    password: "Password123",
    phone: "9876543215",
    gender: "male",
    dateOfBirth: new Date("1995-11-18"),
    religion: "Hindu",
    caste: "Reddy",
    location: { city: "Hyderabad", state: "Telangana", country: "India" },
    bio: "IT consultant, love traveling and movies. Seeking serious relationship.",
    occupation: "IT Consultant",
    profilePicture: { url: "https://via.placeholder.com/300?text=Vikram" },
  },
  {
    firstName: "Divya",
    lastName: "Nair",
    email: "divya.nair@matrimonial.com",
    password: "Password123",
    phone: "9876543216",
    gender: "female",
    dateOfBirth: new Date("2000-02-14"),
    religion: "Hindu",
    caste: "Nair",
    location: { city: "Kochi", state: "Kerala", country: "India" },
    bio: "Teacher by profession, love reading and nature. Open to new experiences.",
    occupation: "Teacher",
    profilePicture: { url: "https://via.placeholder.com/300?text=Divya" },
  },
  {
    firstName: "Aditya",
    lastName: "Malhotra",
    email: "aditya.malhotra@matrimonial.com",
    password: "Password123",
    phone: "9876543217",
    gender: "male",
    dateOfBirth: new Date("1993-09-30"),
    religion: "Hindu",
    caste: "Khatri",
    location: { city: "Pune", state: "Maharashtra", country: "India" },
    bio: "Entrepreneur with passion for tech. Looking for supportive partner.",
    occupation: "Entrepreneur",
    profilePicture: { url: "https://via.placeholder.com/300?text=Aditya" },
  },
  {
    firstName: "Mehira",
    lastName: "Khan",
    email: "mehira.khan@matrimonial.com",
    password: "Password123",
    phone: "9876543218",
    gender: "female",
    dateOfBirth: new Date("1998-06-25"),
    religion: "Muslim",
    caste: "Khan",
    location: { city: "Lucknow", state: "Uttar Pradesh", country: "India" },
    bio: "Journalist, social worker, love helping others. Seeking sincere person.",
    occupation: "Journalist",
    profilePicture: { url: "https://via.placeholder.com/300?text=Mehira" },
  },
  {
    firstName: "Rohan",
    lastName: "Desai",
    email: "rohan.desai@matrimonial.com",
    password: "Password123",
    phone: "9876543219",
    gender: "male",
    dateOfBirth: new Date("1996-04-12"),
    religion: "Hindu",
    caste: "Desai",
    location: { city: "Chennai", state: "Tamil Nadu", country: "India" },
    bio: "Software developer, music enthusiast. Looking for genuine connection.",
    occupation: "Software Developer",
    profilePicture: { url: "https://via.placeholder.com/300?text=Rohan" },
  },
];

async function seedProfiles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Hash passwords and create users
    const hashedProfiles = await Promise.all(
      dummyProfiles.map(async (profile) => {
        const hashedPassword = await bcrypt.hash(profile.password, 10);
        return {
          ...profile,
          password: hashedPassword,
        };
      })
    );

    // Insert profiles
    const result = await User.insertMany(hashedProfiles);
    console.log(`✅ Successfully inserted ${result.length} dummy profiles`);

    // List inserted profiles
    console.log("\n📋 Inserted Profiles:");
    result.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.fullName} (${profile.email})`);
    });

    console.log("\n✨ Sample Login Credentials:");
    console.log("Email: priya.sharma@matrimonial.com");
    console.log("Password: Password123");
    console.log("\nAll profiles use the same password: Password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding profiles:", error);
    process.exit(1);
  }
}

seedProfiles();

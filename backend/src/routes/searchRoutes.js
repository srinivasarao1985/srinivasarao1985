const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// Advanced search with multiple filters
router.post('/advanced-search', authenticate, async (req, res) => {
  try {
    const {
      ageMin,
      ageMax,
      religion,
      caste,
      location,
      occupation,
      gender,
      sortBy = 'createdAt',
      page = 1,
      limit = 20,
    } = req.body;

    const skip = (page - 1) * limit;
    const query = { _id: { $ne: req.user.id } };

    // Age filter
    if (ageMin || ageMax) {
      const now = new Date();
      if (ageMax) {
        query.dateOfBirth = { $gte: new Date(now.getFullYear() - ageMax, now.getMonth(), now.getDate()) };
      }
      if (ageMin) {
        if (query.dateOfBirth) {
          query.dateOfBirth.$lte = new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate());
        } else {
          query.dateOfBirth = { $lte: new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate()) };
        }
      }
    }

    // Religion filter
    if (religion && religion.length > 0) {
      query.religion = { $in: religion };
    }

    // Caste filter
    if (caste && caste.length > 0) {
      query.caste = { $in: caste };
    }

    // Location filter
    if (location && location.length > 0) {
      query['location.city'] = { $in: location };
    }

    // Occupation filter
    if (occupation && occupation.length > 0) {
      query.occupation = { $in: occupation };
    }

    // Gender filter
    if (gender) {
      query.gender = gender;
    }

    // Execute query
    const profiles = await User.find(query)
      .select('firstName lastName age gender religion caste location occupation profilePicture')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get filter options
router.get('/filters/options', async (req, res) => {
  try {
    const religions = await User.distinct('religion');
    const castes = await User.distinct('caste');
    const locations = await User.distinct('location.city');
    const occupations = await User.distinct('occupation');

    res.status(200).json({
      success: true,
      data: {
        religions: religions.filter(Boolean),
        castes: castes.filter(Boolean),
        locations: locations.filter(Boolean),
        occupations: occupations.filter(Boolean),
        genders: ['male', 'female', 'other'],
        ageRange: { min: 18, max: 70 },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

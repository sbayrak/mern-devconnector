const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const request = require('request');
const config = require('config');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/me
// @desc    CREATE OR UPDATE USER PROFILE
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      body('status', 'Status is required').not().isEmpty(),
      body('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      skills,
      githubusername,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // BUILD PROFILE OBJECT
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
      // datayi array e cevirip bosluklari sildi
    }

    // BUILD SOCIAL OBJECT
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // UPDATE
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          {
            new: true,
          }
        );
        return res.json(profile);
      }

      // CREATE
      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error..');
    }
  }
);

// @route   GET api/profile/
// @desc    GET ALL PROFILES
// @access  PUBLIC
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    GET PROFILE BY USER ID
// @access  PUBLIC
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error...');
  }
});

// @route   DELETE api/profile
// @desc    DELETE PROFILE, USER & POSTS
// @access  PRIVATE
router.delete('/', auth, async (req, res) => {
  try {
    // REMOVE USERS POSTS
    await Post.deleteMany({ user: req.user.id });
    // REMOVE PROFILE
    await Profile.findOneAndRemove({ user: req.user.id });
    // REMOVE USER
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Deleted...' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
});
// @route   PUT api/profile/experience
// @desc    ADD PROFILE EXPERIENCE
// @access  PRIVATE
router.put(
  '/experience',
  [
    auth,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('company', 'Company is required').not().isEmpty(),
      body('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title: title,
      company: company,
      location: location,
      from: from,
      to: to,
      current: current,
      description: description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error...');
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    DELETE PROFILE EXPERIENCE
// @access  PRIVATE
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // GET REMOVE INDEX
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error...');
  }
});

// @route   PUT api/profile/education
// @desc    ADD PROFILE education
// @access  PRIVATE
router.put(
  '/education',
  [
    auth,
    [
      body('school', 'school is required').not().isEmpty(),
      body('degree', 'degree is required').not().isEmpty(),
      body('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
      body('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error...');
    }
  }
);

// @route   DELETE api/profile/education/:eedu_id
// @desc    DELETE PROFILE education
// @access  PRIVATE
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // GET REMOVE INDEX
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error...');
  }
});
// @route   GET api/profile/github/:username
// @desc    GET USER REPOS FROM GITHUB
// @access  PUBLIC
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc
      &client_id=${config.get('githubClientId')}&client_secret=${config.get(
        'githubSecret'
      )}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200)
        return res.status(404).json({ msg: 'No github profile found' });

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error...');
  }
});
module.exports = router;

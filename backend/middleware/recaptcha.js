// middleware/recaptcha.js
const axios = require('axios');
const qs = require('querystring');
const verifyRecaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    console.error("Token missing in request:", req.body);
    return res.status(400).json({
      success: false,
      message: 'reCAPTCHA token is required'
    });
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken
        }
      }
    );

    console.log('Google reCAPTCHA response:', response.data);

    if (response.data.success) {
      console.log("Token verified successfully. Calling next().");
      next();
    } else {
      console.error("Verification failed with errors:", response.data['error-codes']);
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed',
        errors: response.data['error-codes']
      });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying reCAPTCHA'
    });
  }
};

module.exports = verifyRecaptcha;
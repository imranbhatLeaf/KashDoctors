const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

exports.getPrediction = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of symptoms'
      });
    }
    const response = await axios.post(`${AI_SERVICE_URL}/predict`, { symptoms });
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('AI Service Prediction Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction from AI service',
      error: error.message
    });
  }
};

exports.getSymptoms = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/symptoms`);
    res.status(200).json({
      success: true,
      data: response.data.symptoms
    });
  } catch (error) {
    console.error('AI Service Symptoms Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch symptoms from AI service',
      error: error.message
    });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, session_id } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }
    const response = await axios.post(`${AI_SERVICE_URL}/chat`, { 
      message,
      session_id 
    });
    // response.data now contains { answer, session_id, recommended_specialty }
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('AI Service Chat Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat response from AI service',
      error: error.message
    });
  }
};
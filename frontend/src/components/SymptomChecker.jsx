import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SymptomChecker.css';

const SymptomChecker = ({ onResult }) => {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await axios.get(`${API_URL}/predict/symptoms`);
        if (res.data.success) {
          setAllSymptoms(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching symptoms:', err);
        setError('Failed to load symptoms. Make sure the AI service is running.');
      }
    };
    fetchSymptoms();
  }, [API_URL]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
    setPrediction(null);
    setError('');
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length < 2) {
      setError('Please select at least 2 symptoms for a better prediction.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/predict`, {
        symptoms: selectedSymptoms
      });
      if (res.data.success) {
        setPrediction(res.data.data);
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSpecialists = () => {
    if (prediction?.speciality) {
      onResult(prediction.speciality); // "Neurologist" matches DB directly
      // smooth scroll to doctor list
      setTimeout(() => {
        document.getElementById('doctor-list')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleChatWithAI = () => {
    const symptomText = selectedSymptoms.map(s => s.replace(/_/g, ' ')).join(', ');
    const prefill =
      `I used the symptom checker and it suggested I might have ${prediction?.disease}. ` +
      `My symptoms are: ${symptomText}. ` +
      `Can you explain this condition and advise me on what to do next?`;
    navigate('/ai-assistant', { state: { prefill } });
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setPrediction(null);
    setError('');
    setSearchTerm('');
    onResult('All');
  };

  const filteredSymptoms = allSymptoms.filter(s =>
    s.toLowerCase().replace(/_/g, ' ').includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(s)
  );

  return (
    <div className="symptom-checker-card">
      <div className="checker-header">
        <div className="checker-icon">🤖</div>
        <div style={{ flex: 1 }}>
          <h3 className="display-xs">AI Symptom Checker</h3>
          <p className="caption">Select your symptoms to find the right specialist. Minimum Two Symptoms.</p>
        </div>
        {prediction && (
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--rounded-pill)',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              color: 'var(--color-ink-muted-80)'
            }}
          >
            Reset
          </button>
        )}
      </div>

      <div className="checker-body">

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search symptoms (e.g. headache, fever)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="symptom-search-input"
          />
        </div>

        {/* Selected symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="selected-symptoms">
            <p className="caption-strong">
              Selected ({selectedSymptoms.length}):
            </p>
            <div className="symptom-pills">
              {selectedSymptoms.map(s => (
                <span
                  key={s}
                  className="symptom-pill active"
                  onClick={() => toggleSymptom(s)}
                >
                  {s.replace(/_/g, ' ')}
                  <span className="pill-close">&times;</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search results */}
        <div className="available-symptoms">
          {searchTerm && filteredSymptoms.length > 0 ? (
            <div className="symptom-pills">
              {filteredSymptoms.slice(0, 12).map(s => (
                <span
                  key={s}
                  className="symptom-pill"
                  onClick={() => toggleSymptom(s)}
                >
                  {s.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          ) : searchTerm && filteredSymptoms.length === 0 ? (
            <p className="caption" style={{ fontStyle: 'italic' }}>
              No symptoms found matching "{searchTerm}"
            </p>
          ) : null}
        </div>

        {/* Error */}
        {error && (
          <p className="error-message" style={{ color: '#E53E3E', fontSize: '13px', marginTop: '8px' }}>
            {error}
          </p>
        )}

        {/* Predict button */}
        <button
          className="button-primary-elevated"
          onClick={handlePredict}
          disabled={loading || selectedSymptoms.length < 2}
          style={{
            marginTop: '20px',
            width: '100%',
            opacity: selectedSymptoms.length < 2 ? 0.5 : 1,
            cursor: selectedSymptoms.length < 2 ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Analyzing...' : `Check Symptoms ${selectedSymptoms.length > 0 ? `(${selectedSymptoms.length})` : ''}`}
        </button>

        {/* Prediction result */}
        {prediction && (
          <div className="prediction-result">
            <div className="result-divider"></div>
            <div className="result-content">

              <p className="caption-strong">Possible Condition:</p>
              <h4 className="display-sm text-gradient">{prediction.disease}</h4>

              {/* Confidence bar */}
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
                <span className="confidence-text">
                  {prediction.confidence}% Confidence
                </span>
              </div>

              {/* Top predictions */}
              {prediction.top_predictions?.length > 1 && (
                <div style={{ marginTop: '12px', marginBottom: '16px' }}>
                  <p className="caption" style={{ color: 'var(--color-ink-muted-80)', marginBottom: '8px' }}>
                    Other possibilities:
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {prediction.top_predictions.slice(1).map(p => (
                      <span
                        key={p.disease}
                        style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          backgroundColor: 'var(--color-surface-pearl)',
                          border: '1px solid var(--color-hairline)',
                          borderRadius: 'var(--rounded-pill)',
                          color: 'var(--color-ink-muted-80)'
                        }}
                      >
                        {p.disease} · {p.confidence}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Speciality recommendation */}
              <div className="recommendation-box">
                <p className="body">
                  Based on your symptoms, we recommend consulting a:
                </p>
                <div className="specialist-recommendation">
                  <span className="specialist-name">
                    {prediction.speciality}
                  </span>
                  <button
                    className="button-pill-outline small"
                    onClick={handleViewSpecialists}
                  >
                    View Specialists ↓
                  </button>
                </div>

                {/* Chat with AI Assistant for further help */}
                <button
                  className="button-primary-elevated"
                  onClick={handleChatWithAI}
                  style={{
                    marginTop: '14px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  💬 Talk more about this with the AI Assistant
                </button>
              </div>

              {/* Disclaimer */}
              <p style={{
                fontSize: '11px',
                color: 'var(--color-ink-muted-80)',
                marginTop: '12px',
                fontStyle: 'italic'
              }}>
                ⚠️ This is not a medical diagnosis. Always consult a qualified doctor.
              </p>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;

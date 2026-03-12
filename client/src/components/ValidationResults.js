import React from 'react';
import './ValidationResults.css';

function ValidationResults({ result }) {
  if (!result || typeof result !== 'object') {
    return (
      <div className="validation-results">
        <p>No validation results to display.</p>
      </div>
    );
  }

  const confidencePct = Math.max(0, Math.min(100, Number(result.confidence_score) || 0));

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALID':
        return '#4caf50';
      case 'INVALID':
        return '#f44336';
      case 'SUSPICIOUS':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VALID':
        return '✓';
      case 'INVALID':
        return '✗';
      case 'SUSPICIOUS':
        return '⚠';
      default:
        return '?';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 50) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="validation-results">
      <div className="results-header">
        <h2>Validation Results</h2>
        <div className="overall-status" style={{ color: getStatusColor(result.overall_status || '') }}>
          <span className="status-icon">{getStatusIcon(result.overall_status || '')}</span>
          <span className="status-text">{result.overall_status || 'UNKNOWN'}</span>
        </div>
      </div>

      <div className="confidence-score">
        <label>Confidence Score:</label>
        <div className="score-bar-container">
          <div
            className="score-bar"
            style={{
              width: `${confidencePct}%`,
              backgroundColor: getConfidenceColor(confidencePct)
            }}
          />
          <span className="score-value">{confidencePct}%</span>
        </div>
      </div>

      {result.security_warnings && result.security_warnings.length > 0 && (
        <div className="security-warnings">
          <h3>⚠️ Security Warnings</h3>
          <ul>
            {result.security_warnings.map((warning, index) => (
              <li key={index}>
                {typeof warning === 'string'
                  ? warning
                  : (
                      <>
                        {warning.field && <strong>{warning.field}:</strong>}
                        {warning.field && ' '}
                        {warning.threat && `${warning.threat} - `}
                        {warning.message || ''}
                      </>
                    )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="field-results">
        <h3>Field Details</h3>
        {Object.entries(result.fields || {}).map(([fieldName, fieldResult]) => {
          const status = fieldResult?.status ?? '';
          const issues = Array.isArray(fieldResult?.issues) ? fieldResult.issues : [];
          const suggested = fieldResult?.suggested_value;
          return (
          <div key={fieldName} className="field-result">
            <div className="field-header">
              <span className="field-name">{fieldName}</span>
              <span
                className="field-status"
                style={{ color: getStatusColor(status) }}
              >
                {getStatusIcon(status)} {status || 'UNKNOWN'}
              </span>
            </div>

            {issues.length > 0 && (
              <div className="field-issues">
                <strong>Issues:</strong>
                <ul>
                  {issues.map((issue, index) => (
                    <li key={index}>{typeof issue === 'string' ? issue : String(issue)}</li>
                  ))}
                </ul>
              </div>
            )}

            {suggested != null && String(suggested).trim() !== '' && (
              <div className="field-suggestion">
                <strong>Suggested Value:</strong>
                <div className="suggested-value">{String(suggested)}</div>
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default ValidationResults;

const formValidator = require('../server/services/formValidator');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        overall_status: 'INVALID',
        fields: {},
        security_warnings: ['Invalid request format'],
        confidence_score: 0
      });
    }

    const validationResult = await formValidator.validateForm(body);
    return res.status(200).json(validationResult);
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({
      overall_status: 'INVALID',
      fields: {},
      security_warnings: ['Internal server error'],
      confidence_score: 0
    });
  }
};


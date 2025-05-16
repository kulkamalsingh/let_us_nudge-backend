import NudgeModel from '../models/nudge.model.js';

export const updateConsent = async (req, res) => {
  try {
    const { nudge_id, table_id, consent, consentAt } = req.body;

    const updatedNudge = await NudgeModel.findOneAndUpdate(
      { nudge_id, table_id },
      { consent, consentAt },
      { new: true }
    );

    if (!updatedNudge) {
      return res.status(404).json({
        success: false,
        message: 'Nudge not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Nudge updated successfully',
      data: updatedNudge
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

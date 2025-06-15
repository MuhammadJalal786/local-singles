// backend/controllers/supportController.js

/**
 * POST /api/support
 * Body: { subject, message }
 * Just logs to console for now or stores in a “Support” collection.
 */
exports.sendSupportMessage = async (req, res) => {
  try {
    // 1) We expect a logged‐in user
    const userId = req.session?.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required.' });
    }

    // 2) For simplicity, we’ll just console.log here.
    //    In a real app, you might insert into a SupportMessage collection or send an email.
    console.log(`📩 Support message from user ${userId}:\nSubject: ${subject}\nMessage:\n${message}`);

    return res.json({ message: 'Support request sent. We will be in touch shortly.' });
  } catch (err) {
    console.error('sendSupportMessage error:', err);
    return res.status(500).json({ message: 'Could not send support message.' });
  }
};

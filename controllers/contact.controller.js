import ContactRequest from '../models/contact.model.js';

export const SubmitContactForm = async (req, res) => {
  try {
    const { name, email, phone, country_code, description } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and description are required',
      });
    }

    const contact = await ContactRequest.create({
      name,
      email,
      phone,
      country_code,
      description,
    });

    return res.status(201).json({
      success: true,
      message: 'Contact request sent successfully',
      data: contact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
      error: error.message,
    });
  }
};

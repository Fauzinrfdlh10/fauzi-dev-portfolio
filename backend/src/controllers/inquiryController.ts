import { Request, Response } from 'express';
import prisma from '../utils/db';
import { sendEmail } from '../utils/email';

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  const { full_name, email, subject, message } = req.body;

  try {
    const newInquiry = await prisma.inquiry.create({
      data: {
        full_name,
        email,
        subject,
        message,
      },
    });

    // Send email notification to admin
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL || 'admin@portfolio.dev',
        `New Inquiry: ${subject}`,
        `You have received a new inquiry from your portfolio website.\n\nName: ${full_name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}\n`
      );
    } catch (emailError) {
      console.error('Failed to send notification email', emailError);
      // We don't fail the request if email fails, but we log it
    }

    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: newInquiry });
  } catch (error) {
    console.error('Create inquiry error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.inquiry.count(),
    ]);

    res.json({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get inquiries error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInquiryById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      res.status(404).json({ message: 'Inquiry not found' });
      return;
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Get inquiry error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  try {
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    res.json(updatedInquiry);
  } catch (error) {
    console.error('Update inquiry status error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  try {
    await prisma.inquiry.delete({ where: { id } });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete inquiry error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const replyToInquiry = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { replyMessage } = req.body;

  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      res.status(404).json({ message: 'Inquiry not found' });
      return;
    }

    let emailSent = true;
    try {
      // Send reply email
      await sendEmail(
        inquiry.email,
        `Re: ${inquiry.subject}`,
        `${replyMessage}\n\n---\nOriginal Message:\n${inquiry.message}`
      );
    } catch (emailError) {
      console.error('Failed to send reply email', emailError);
      emailSent = false;
    }

    // Update status to contacted
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: 'contacted' },
    });

    if (emailSent) {
      res.json({ message: 'Reply sent successfully', inquiry: updatedInquiry });
    } else {
      res.status(200).json({ message: 'Status updated, but email sending failed (Check SMTP configs)', inquiry: updatedInquiry });
    }
  } catch (error) {
    console.error('Reply inquiry error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

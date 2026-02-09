// Email notification utilities using Resend
import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email notification using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured, skipping email notification');
      return false;
    }

    // Log API key prefix for verification (first 10 chars only for security)
    console.log('🔑 Using Resend API key:', resendApiKey.substring(0, 10) + '...');
    
    const resend = new Resend(resendApiKey);
    
    // Get the "from" email address from env or use a default
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return false;
    }

    console.log('✅ Email sent successfully:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send notification for new contact submission
 */
export async function notifyNewContactSubmission(
  submission: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  }
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping email notification');
    return;
  }

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${submission.firstName} ${submission.lastName}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>Message:</strong></p>
    <p>${submission.message.replace(/\n/g, '<br>')}</p>
    <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/contact-submissions">View in admin panel</a></p>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `New Contact Form Submission from ${submission.firstName} ${submission.lastName}`,
    html,
    text: `New contact form submission from ${submission.firstName} ${submission.lastName}\n\nEmail: ${submission.email}\n\nMessage:\n${submission.message}`,
  });
}

/**
 * Send notification for new lead
 */
export async function notifyNewLead(
  lead: {
    id: number;
    name: string;
    organisation: string;
    email: string | null;
    phone: string | null;
    score: number;
  }
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping email notification');
    return;
  }

  const html = `
    <h2>New Lead Submission</h2>
    <p><strong>Name:</strong> ${lead.name}</p>
    <p><strong>Organisation:</strong> ${lead.organisation}</p>
    ${lead.email ? `<p><strong>Email:</strong> ${lead.email}</p>` : ''}
    ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
    <p><strong>Lead Score:</strong> ${lead.score}</p>
    <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/chatbot?tab=callbacks">View in admin panel</a></p>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `New Lead: ${lead.name} from ${lead.organisation}`,
    html,
    text: `New lead submission:\n\nName: ${lead.name}\nOrganisation: ${lead.organisation}\n${lead.email ? `Email: ${lead.email}\n` : ''}${lead.phone ? `Phone: ${lead.phone}\n` : ''}Lead Score: ${lead.score}`,
  });
}

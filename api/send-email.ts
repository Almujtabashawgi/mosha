// @ts-ignore
import { Resend } from "resend";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);

    const { name, email, phone, subject, message } = req.body;

    const response = await resend.emails.send({
      from: "Moshaltd Website <info@moshaltd.com>",
      to: ["info@moshaltd.com"],
      replyTo: email, // مهم جداً عشان تقدر ترد على الزبون
      subject: `New Contact Message - ${subject}`,
      html: `
        <h2>New message from website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true, response });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
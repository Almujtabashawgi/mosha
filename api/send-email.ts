import { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔥 اهم سطر ناقص عندك
    const { name, email, phone, subject, message } = req.body;

    // حماية بسيطة
    if (!email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const data = await resend.emails.send({
      from: "Moshaltd Website <onboarding@resend.dev>",
      to: ["info@moshaltd.com"],
      reply_to: email as any,
      subject: `New Contact Message - ${subject}`,
      html: `
        <h2>New message from website</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    } as any);

    return res.status(200).json({ success: true, data });

  } catch (error: any) {
    console.log("EMAIL ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
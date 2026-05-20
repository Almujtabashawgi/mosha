import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {

    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    const data = await resend.emails.send({

      from: "Moshal Website <onboarding@resend.dev>",

      to: ["info@moshaltd.com"],

      replyTo: email,

      subject: `New Contact Message - ${subject}`,

      html: `
        <div style="font-family:Arial;padding:20px">

          <h2>📩 New Contact Form Submission</h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>

          <p><strong>Subject:</strong> ${subject}</p>

          <hr />

          <p><strong>Message:</strong></p>

          <p>${message}</p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Email failed",
    });
  }
}
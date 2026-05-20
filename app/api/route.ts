import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    const data = await resend.emails.send({
      from: "Moshaltd Website <onboarding@resend.dev>",
      to: ["info@moshaltd.com"],
      reply_to: email, // الصحيح underscore
      subject: `New Contact Message - ${subject}`,
      html: `
        <h2>New message from website</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    return Response.json({ success: true, data });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
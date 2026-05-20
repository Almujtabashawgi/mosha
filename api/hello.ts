export default async function handler(req: any, res: any) {

  try {

    return res.status(200).json({
      success: true,
      env: process.env.RESEND_API_KEY ? "FOUND" : "MISSING"
    });

  } catch (err) {

    return res.status(500).json({
      error: "FAILED"
    });
  }
}
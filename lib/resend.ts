import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  total: number
): Promise<void> {
  await resend.emails.send({
    from: "FreshFarm <orders@freshfarm.app>",
    to: email,
    subject: `Order #${orderId.slice(0, 8)} Confirmed! 🥚`,
    html: `<p>Your order of $${(total / 100).toFixed(2)} has been confirmed. We'll deliver your fresh eggs soon!</p>`,
  });
}

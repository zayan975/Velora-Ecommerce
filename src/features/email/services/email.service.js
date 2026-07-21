// src/services/email.service.js
import resend from "@/lib/resend";

export const sendOrderConfirmationEmail = async (order, userEmail) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" width="50" height="50" style="border-radius: 4px; vertical-align: middle; margin-right: 10px;" />
          ${item.name}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #111;">Order Confirmed! 🎉</h1>
      <p>Hi ${order.shippingAddress.fullName}, thanks for your order. Here are the details:</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
            <th style="padding: 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top: 20px; text-align: right;">
        <p>Subtotal: Rs. ${order.subtotal}</p>
        <p>Shipping: Rs. ${order.shipping}</p>
        <h3>Total: Rs. ${order.total}</h3>
      </div>

      <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 6px;">
        <h4 style="margin-top: 0;">Shipping Address</h4>
        <p>${order.shippingAddress.fullName}</p>
        <p>${order.shippingAddress.addressLine}, ${order.shippingAddress.city}</p>
        <p>${order.shippingAddress.phone}</p>
      </div>

      <p style="margin-top: 30px; color: #777; font-size: 13px;">Thank you for shopping with us!</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Velora <onboarding@resend.dev>", // custom domain verify karne ke baad apna daal dena
      to: userEmail,
      subject: `Order Confirmed - #${order._id}`,
      html,
    });
    console.log("✅ Order confirmation email sent to", userEmail);
  } catch (error) {
    console.error("❌ Failed to send order email:", error.message);
    // Email fail ho to order creation ko fail mat karo, bas log kar do
  }
};
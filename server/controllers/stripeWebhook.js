import stripe from 'stripe';
import { prisma } from '../configs/prisma.js';
import { inngest } from '../inngest/index.js';

export const stripeWebhook = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  if (endPointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];

    try {
      // Verify the event using the signature and the endpoint secret
      event = stripeInstance.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.log(`Webhook signature verification failed: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const sessionList = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntent.id,
          });
          const session = sessionList.data[0];
          const { transactionId, appId } = session.metadata;

          if (appId === 'flipEarn' && transactionId) {
            const transaction = await prisma.transaction.update({
              where: { id: transactionId },
              data: { isPaid: true },
            });

            //   Send new Credentials to the buyer using the email address;
            await inngest.send({
              name: 'app/purchase',
              data: { transaction },
            });

            // Mark the listing as sold
            await prisma.listing.update({
              where: { id: transaction.listingId },
              data: { status: 'sold' },
            });

            // Add the amount to the user's earned balance
            await prisma.user.update({
              where: { id: transaction.ownerId },
              data: { earned: { increment: transaction.amount } },
            });
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      response.status(200).send('Event received');
    } catch (error) {
      console.error('Error handling webhook event:', error);
      response.status(500).send('Internal Server Error');
    }
  }
};

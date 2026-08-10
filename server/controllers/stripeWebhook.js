import stripe from 'stripe';
import { prisma } from '../configs/prisma.js';
import { inngest } from '../inngest/index.js';

export const stripeWebhook = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('🔥 STRIPE WEBHOOK RECEIVED');

  if (!endpointSecret) {
    return response
      .status(500)
      .send('Server configuration missing STRIPE_WEBHOOK_SECRET');
  }

  // Get the signature sent by Stripe
  const signature = request.headers['stripe-signature'];

  let event;

  try {
    // Verify the event using the signature and the endpoint secret
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      signature,
      endpointSecret,
    );
    console.log('========== STRIPE WEBHOOK ==========');
    console.log('EVENT:', event.type);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        const { transactionId, appId } = session.metadata || {};

        if (appId !== 'flipEarn' || !transactionId) {
          console.log('Invalid Checkout Session metadata');
          break;
        }

        const transaction = await prisma.transaction.findUnique({
          where: { id: transactionId },
        });

        if (!transaction) {
          console.error(`Transaction ${transactionId} not found`);
          break;
        }

        // Stripe may send the webhook more than once.
        if (transaction.isPaid) {
          console.log(`Transaction ${transactionId} already processed`);
          break;
        }

        const updatedTransaction = await prisma.$transaction(async (tx) => {
          // Mark transaction paid
          const updated = await tx.transaction.update({
            where: { id: transactionId },
            data: { isPaid: true },
          });

          // Mark the listing as sold
          await tx.listing.update({
            where: { id: transaction.listingId },
            data: { status: 'sold' },
          });

          // Add the amount to the user's earned balance
          await tx.user.update({
            where: { id: transaction.ownerId },
            data: {
              earned: { increment: transaction.amount },
            },
          });
          return updated;
        });

        //   Send new Credentials to the buyer using the email address;
        await inngest.send({
          name: 'app/purchase',
          data: {
            transaction: updatedTransaction,
          },
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    response.status(200).send('Event received');
  } catch (error) {
    console.error('Error handling webhook event:', error);
    response.status(500).send('Internal Server Error');
  }
};

import { Inngest } from 'inngest';
import { prisma } from '../configs/prisma.js';
import sendEmail from '../configs/nodemailer.js';

// Helper to escape values inserted into HTML emails
const escapeHtml = (unsafe) => {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe).replace(/[&<>"'\/]/g, (c) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    }[c];
  });
};

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'profile-marketplace' });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk', triggers: [{ event: 'clerk/user.created' }] },
  async ({ event }) => {
    const { data } = event;

    //   Check if user already exists in the database
    const user = await prisma.user.findFirst({
      where: { id: data.id },
    });

    if (user) {
      //   Update user data if it exists
      await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data?.email_addresses[0]?.email_address,
          name: data?.first_name + ' ' + data?.last_name,
          image: data?.image_url,
        },
      });
      return;
    }
    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + ' ' + data?.last_name,
        image: data?.image_url,
      },
    });
  },
);

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-with-clerk',
    triggers: [{ event: 'clerk/user.deleted' }],
  },
  async ({ event }) => {
    const listings = await prisma.listing.findMany({
      where: { ownerId: data.id },
    });

    const chats = await prisma.chat.findMany({
      where: { OR: [{ ownerUserId: data.id }, { chatUserId: data.id }] },
    });

    const transactions = await prisma.transactions.findMany({
      where: { userId: data.id },
    });

    if (listings.length === 0 && chats.length === 0 && transactions === 0) {
      await prisma.user.delete({ where: { id: data.id } });
    } else {
      await prisma.listing.updateMany({
        where: { ownerId: data.id },
        data: { status: 'inactive' },
      });
    }
  },
);

// Inngest Function to update user data to a database
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk', triggers: [{ event: 'clerk/user.updated' }] },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + ' ' + data?.last_name,
        image: data?.image_url,
      },
    });
  },
);

// Inngest Function to send purchase email to the customer
const sendPurchaseEmail = inngest.createFunction(
  { id: 'send-purchase-email', triggers: [{ event: 'app/purchase' }] },

  async ({ event }) => {
    const { transaction } = event.data;

    const customer = await prisma.user.findFirst({
      where: { id: transaction.userId },
    });

    const listing = await prisma.listing.findFirst({
      where: { id: transaction.listingId },
    });

    const credential = await prisma.credential.findFirst({
      where: { listingId: transaction.listingId },
    });

    const supportEmail = process.env.SENDER_EMAIL || 'support@example.com';

    await sendEmail({
      to: customer.email,
      subject: 'Your account purchase credentials',
      html: `
        <h2>Thank you for your purchase.</h2>
        <p>
          Your account purchase of @${escapeHtml(listing.username)} on ${escapeHtml(
            listing.platform,
          )} is complete.
          Below are the credentials associated with your order.
        </p>
        <h3>Credentials</h3>
        <div>
          ${credential.updatedCredential
            .map(
              (cred) => `
            <p><strong>${escapeHtml(cred.name)}:</strong> ${escapeHtml(
              cred.value,
            )}</p>
          `,
            )
            .join('')}
        </div>
        <p>
          If you have any questions, please contact our support team at
          <a href="mailto:${supportEmail}">${escapeHtml(supportEmail)}</a>.
        </p>
      `,
    });
  },
);

// Inngest Function to send new credentials for deleted listings

const sendNewCredentials = inngest.createFunction(
  { id: 'send-new-credentials', triggers: [{ event: '/app/listing-deleted' }] },

  async ({ event }) => {
    const { listing, listingId } = event.data;

    const newCredential = await prisma.credential.findFirst({
      where: { listingId },
    });

    if (newCredential) {
      const supportEmail = process.env.SENDER_EMAIL || 'support@example.com';

      await sendEmail({
        to: listing.owner.email,
        subject: 'Updated credentials for your deleted listing',
        html: `
        <h2>Updated credentials for your deleted listing</h2>
        <p>
          The credentials for the listing titled <strong>${escapeHtml(
            listing.title,
          )}</strong>
          (${escapeHtml(listing.platform)}) have been updated successfully.
        </p>
        <p>
          Username: <strong>${escapeHtml(listing.username)}</strong>
        </p>

        <h3>New Credentials</h3>
        <div>
          ${newCredential.updatedCredential
            .map(
              (cred) => `
            <p><strong>${escapeHtml(cred.name)}:</strong> ${escapeHtml(
              cred.value,
            )}</p>
          `,
            )
            .join('')}
        </div>

        <h3>Previous Credentials</h3>
        <div>
          ${newCredential.originalCredential
            .map(
              (cred) => `
            <p><strong>${escapeHtml(cred.name)}:</strong> ${escapeHtml(
              cred.value,
            )}</p>
          `,
            )
            .join('')}
        </div>

        <p>
          If you have any questions, please contact our support team at
          <a href="mailto:${supportEmail}">${escapeHtml(supportEmail)}</a>.
        </p>
        `,
      });
    }
  },
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  sendPurchaseEmail,
  sendNewCredentials,
];

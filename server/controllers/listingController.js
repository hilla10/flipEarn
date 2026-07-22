import fs from 'fs';
import imagekit from '../configs/imagekit.js';
import { prisma } from '../configs/prisma.js';

// Controller for Adding Listing to Database

export const addListing = async (req, res) => {
  try {
    const { userId } = await req.auth();

    if (req.plan !== 'premium') {
      const listingCount = await prisma.listing.count({
        where: { ownerId: userId },
      });

      if (listingCount >= 5) {
        return res.status(403).json({
          message:
            'You have reached the free listing limit. Upgrade to premium to add more listings!',
        });
      }
    }

    const accountDetails = JSON.parse(req.body.accountDetails);

    accountDetails.followers_count = parseInt(accountDetails.followers_count);
    accountDetails.engagement_rate = parseInt(accountDetails.engagement_rate);
    accountDetails.monthly_views = parseInt(accountDetails.monthly_views);
    accountDetails.price = parseInt(accountDetails.price);
    accountDetails.platform = accountDetails.platform.toLowerCase();
    accountDetails.niche = accountDetails.niche.toLowerCase();

    accountDetails.username.startsWith('@')
      ? (accountDetails.username = accountDetails.username.slice(1))
      : null;

    const uploadImages = req.files.map(async (file) => {
      const response = await imagekit.files.upload({
        file: fs.createReadStream(file.path),
        folder: 'flip-earn',
        fileName: `${Date.now()}.png`,
        transformation: { pre: 'w-1280, h-auto' },
      });

      return response.url;
    });

    // Wait for all image uploads to complete
    const images = await Promise.all(uploadImages);

    const listing = await prisma.listing.create({
      data: {
        ownerId: userId,
        images,
        ...accountDetails,
      },
    });

    return res
      .status(201)
      .json({ message: 'Account Listed successfully', listing });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

// Controller For Getting All Public Listing
export const getAllPublicListing = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'active' },
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!listings || listings.length === 0) return res.json({ listings: [] });

    return res.json({ listings });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

// Controller for Getting All User Listing
export const getAllUserListing = async (req, res) => {
  try {
    const { userId } = await req.auth();

    // get all listings except deleted
    const listings = await prisma.listing.findMany({
      where: { ownerId: userId, status: { not: 'deleted' } },
      orderBy: { createdAt: 'desc' },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const balance = {
      earned: user.earned,
      withdrawn: user.withdrawn,
      available: user.earned - user.withdrawn,
    };

    if (!listings || listings.length === 0)
      return res.json({ listings: [], balance });
    return res.json({ listings, balance });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

// Controller for Updating Listing in Database
export const updateListing = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const accountDetails = JSON.parse(req.body.accountDetails);

    if (req.files.length + accountDetails.images.length > 5) {
      return res
        .status(400)
        .json({ message: 'You can upload a maximum of 5 images per listing.' });
    }

    accountDetails.followers_count = parseInt(accountDetails.followers_count);
    accountDetails.engagement_rate = parseInt(accountDetails.engagement_rate);
    accountDetails.monthly_views = parseInt(accountDetails.monthly_views);
    accountDetails.price = parseInt(accountDetails.price);
    accountDetails.platform = accountDetails.platform.toLowerCase();
    accountDetails.niche = accountDetails.niche.toLowerCase();

    accountDetails.username.startsWith('@')
      ? (accountDetails.username = accountDetails.username.slice(1))
      : null;

    const listing = await prisma.listing.update({
      where: { id: accountDetails.id, ownerId: userId },
      data: accountDetails,
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status === 'sold')
      return res
        .status(400)
        .json({ message: "You can't update a sold listing" });

    if (req.files.length > 0) {
      const uploadImages = req.files.map(async (file) => {
        const response = await imagekit.files.upload({
          file: fs.createReadStream(file.path),
          folder: 'flip-earn',
          fileName: `${Date.now()}.png`,
          transformation: { pre: 'w-1280, h-auto' },
        });

        return response.url;
      });

      // Wait for all image uploads to complete
      const images = await Promise.all(uploadImages);

      const listing = await prisma.listing.update({
        where: { id: accountDetails.id, ownerId: userId },
        data: {
          ownerId: userId,
          ...accountDetails,
          images: [...accountDetails.images, ...images],
        },
      });
      return res.json({ message: 'Account Updated Successfully', listing });
    }
    return res.json({ message: 'Account Updated Successfully', listing });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = await req.auth();

    const listing = await prisma.listing.findUnique({
      where: { id, ownerId: userId },
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status === 'active' || listing.status === 'inactive') {
      await prisma.listing.update({
        where: { id, ownerId: userId },
        data: { status: listing.status === 'active' ? 'inactive' : 'active' },
      });
    } else if (listing.status === 'ban')
      return res
        .status(403)
        .json({ message: 'You are banned from listing accounts' });
    else if (listing.status === 'sold')
      return res.status(400).json({ message: 'Your listing is sold' });

    return res.json({
      message: 'Listing Status Updated Successfully',
      listing,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

// Controller for Deleting Listing from Database

export const deleteUserListing = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { listingId } = req.params;

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, ownerId: userId },
      include: { owner: true },
    });

    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.status === 'sold')
      return res
        .status(400)
        .json({ message: "You can't delete a sold listing" });

    // If password has been changed, send the new password to the owners
    if (listing.isCredentialChanged) {
      // send email to owner
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'deleted' },
    });

    return res.json({ message: 'Listing Deleted Successfully' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

export const addCredential = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { listingId, credential } = req.body;

    if (credential.length === 0 || !listingId) {
      return res
        .status(400)
        .json({ message: 'Listing Id and Credential are required' });
    }

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, ownerId: userId },
    });

    if (!listing)
      return res
        .status(404)
        .json({ message: 'Listing not found or you are not the owner' });

    await prisma.credential.create({
      data: {
        listingId,
        originalCredential: credential,
      },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: { isCredentialSubmitted: true },
    });

    return res.json({ message: 'Credential added successfully.' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

export const markFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = await req.auth();

    if (req.plan !== 'premium') {
      return res.status(400).json({ message: 'Premium plan required.' });
    }

    // Unset all other featured listings
    await prisma.listing.updateMany({
      where: { ownerId: userId },
      data: { featured: false },
    });

    // Mark the listing as featured
    await prisma.listing.update({
      where: { id },
      data: { featured: true },
    });

    return res.json({ message: 'Listing marked as featured' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

export const getAllUserOrders = async (req, res) => {
  try {
    const { userId } = await req.auth();

    let orders = await prisma.transaction.findMany({
      where: { userId, isPaid: true },
      include: { listing: true },
    });

    if (!orders || orders.length === 0) return res.json({ orders: [] });

    //  Attach the credential to each order
    const credentials = await prisma.credential.findMany({
      where: { listingId: { in: orders.map((order) => order.listingId) } },
    });

    const ordersWithCredentials = orders.map((order) => {
      const credential = credentials.find(
        (cred) => cred.listingId === order.listingId,
      );
      return { ...order, credential };
    });

    return res.json({ orders: ordersWithCredentials });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

export const withdrawAmount = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { amount, account } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const balance = user.earned - user.withdrawn;

    if (amount > balance)
      return res.status(400).json({ message: 'Insufficient balance' });

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        account,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { withdrawn: { increment: amount } },
    });

    return res.json({ message: 'Applied for Withdrawal', withdrawal });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

export const purchaseAccount = async (req, res) => {
  try {
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || error.code || 'Server Error' });
  }
};

import { clerkClient } from '@clerk/express';

export const protect = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasPremiumPlan = await has({ plan: 'premium' });
    req.plan = hasPremiumPlan ? 'premium' : 'free';
    return next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ message: error.code || error.message || 'Unauthorized' });
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await clerkClient.users.getUser(userId);

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase());
    const primaryEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const isAdmin = Boolean(primaryEmail) && adminEmails.includes(primaryEmail);

    if (!isAdmin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ message: error.code || error.message || 'Unauthorized' });
  }
};

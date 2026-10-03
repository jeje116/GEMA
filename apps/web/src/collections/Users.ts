import type { CollectionConfig, Access, FieldAccess } from 'payload';

const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin';
};

const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return {
    id: {
      equals: user.id,
    },
  };
};

const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin';
};

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'SYSTEM',
  },
  auth: true,
  access: {
    // Only admins can create new users
    create: isAdmin,
    // Admins can read all users; editors can only read their own user record
    read: isAdminOrSelf,
    // Admins can update all users; editors can only update their own record
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdmin,
    // Both admin and editor can access the admin panel
    admin: ({ req: { user } }) => Boolean(user?.role === 'admin' || user?.role === 'editor'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Critical: Only an Admin can assign or change the role field.
        // Editors updating their own profile cannot elevate themselves to Admin.
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
};

import type { CollectionConfig } from 'payload';
import { APIError } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'MEDIA',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media/cms'),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        const { payload } = req;
        const mediaId = id;

        // Check Homepage Global
        try {
          const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0, overrideAccess: true });
          if (homepage) {
            const heroMatch = homepage.hero?.image === mediaId;
            const teaserMatch =
              homepage.cuisineTeaser?.item01?.image === mediaId ||
              homepage.cuisineTeaser?.item02?.image === mediaId ||
              homepage.cuisineTeaser?.item03?.image === mediaId ||
              homepage.cuisineTeaser?.item04?.image === mediaId;
            const spaceMatch = homepage.space?.imagePrimary === mediaId || homepage.space?.imageSecondary === mediaId;
            if (heroMatch || teaserMatch || spaceMatch) {
              throw new APIError('Cannot delete media that is actively referenced in the Homepage.', 400);
            }
          }
        } catch (e: any) {
          if (e instanceof APIError) throw e;
        }

        // Check Chef Global
        try {
          const chef = await payload.findGlobal({ slug: 'chef', depth: 0, overrideAccess: true });
          if (chef) {
            if (chef.portrait === mediaId || chef.videoFile === mediaId || chef.videoPoster === mediaId) {
              throw new APIError('Cannot delete media that is actively referenced in Chef Global.', 400);
            }
          }
        } catch (e: any) {
          if (e instanceof APIError) throw e;
        }

        // Check PageMedia Global
        try {
          const pageMedia = await payload.findGlobal({ slug: 'page-media', depth: 0, overrideAccess: true });
          if (pageMedia) {
            const menuMatch = pageMedia.menu?.foodImage === mediaId || pageMedia.menu?.beverageImage === mediaId;
            const aboutMatch = pageMedia.about?.originImage === mediaId || pageMedia.about?.philosophyImage === mediaId || pageMedia.about?.architectureImage === mediaId;
            const expMatch = pageMedia.experience?.heroImage === mediaId || pageMedia.experience?.morningImage === mediaId || pageMedia.experience?.eveningImage === mediaId || pageMedia.experience?.detailsImage === mediaId || pageMedia.experience?.craftImage === mediaId;
            const occMatch = pageMedia.occasions?.heroImage === mediaId || pageMedia.occasions?.privateDiningImage === mediaId || pageMedia.occasions?.weddingImage === mediaId || pageMedia.occasions?.birthdayImage === mediaId || pageMedia.occasions?.brandMondialImage === mediaId || pageMedia.occasions?.brandFrankCoImage === mediaId || pageMedia.occasions?.brandMaharvaImage === mediaId;
            if (menuMatch || aboutMatch || expMatch || occMatch) {
              throw new APIError('Cannot delete media that is actively referenced in Page Media.', 400);
            }
          }
        } catch (e: any) {
          if (e instanceof APIError) throw e;
        }

        // Check Events collection
        try {
          const events = await payload.find({
            collection: 'events',
            where: { coverImage: { equals: mediaId } },
            limit: 1,
            overrideAccess: true,
          });
          if (events.totalDocs > 0) {
            throw new APIError('Cannot delete media that is actively referenced by an Event.', 400);
          }
        } catch (e: any) {
          if (e instanceof APIError) throw e;
        }

        // Check Journal Posts collection
        try {
          const journal = await payload.find({
            collection: 'journal-posts',
            where: { coverImage: { equals: mediaId } },
            limit: 1,
            overrideAccess: true,
          });
          if (journal.totalDocs > 0) {
            throw new APIError('Cannot delete media that is actively referenced by a Journal Post.', 400);
          }
        } catch (e: any) {
          if (e instanceof APIError) throw e;
        }

        // Check Menu Items collection
        try {
          const menuItems = await payload.find({
            collection: 'menu-items',
            where: { image: { equals: mediaId } },
            limit: 1,
            overrideAccess: true,
          });
          if (menuItems.totalDocs > 0) {
            throw new APIError('Cannot delete media that is actively referenced by a Menu Item.', 400);
          }
        } catch (e: any) {
          if (e instanceof APIError) throw e;
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'sourceKey',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Internal migration identity key (used for deterministic seeding).',
      },
    },
  ],
};

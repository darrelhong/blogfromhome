import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z
      .object({
        url: z.string().optional(),
        alt: z.string().optional(),
      })
      .optional(),
    pubDate: z.date(),
    author: z.string(),
    description: z.string().optional(),
    readTime: z.number().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};

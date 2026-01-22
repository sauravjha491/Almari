import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedProduct = {
  slug: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: { url: string; alt: string }[];
};

function npr(paisa: number) {
  return paisa;
}

async function main() {
  const categories: Array<{
    slug: string;
    name: string;
    imageUrl: string;
    products: SeedProduct[];
  }> = [
    {
      slug: "electronics",
      name: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      products: [
        {
          slug: "almari-buds-pro",
          title: "Almari Buds Pro",
          description:
            "Wireless earbuds with active noise cancellation, clear calls, and a pocket-friendly case.",
          price: npr(499900),
          compareAtPrice: npr(699900),
          stock: 60,
          images: [
            {
              url: "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=1200&q=80",
              alt: "Wireless earbuds in a case",
            },
          ],
        },
        {
          slug: "almari-smart-watch-s2",
          title: "Almari Smart Watch S2",
          description:
            "Bright display, week-long battery, and fitness tracking designed for everyday wear.",
          price: npr(849900),
          stock: 25,
          images: [
            {
              url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
              alt: "Smart watch on a table",
            },
          ],
        },
      ],
    },
    {
      slug: "home-living",
      name: "Home & Living",
      imageUrl:
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80",
      products: [
        {
          slug: "almari-storage-organizer-set",
          title: "Storage Organizer Set (6 pcs)",
          description:
            "Foldable storage bins for wardrobes and shelves. Keeps your space neat and tidy.",
          price: npr(129900),
          compareAtPrice: npr(179900),
          stock: 80,
          images: [
            {
              url: "https://images.unsplash.com/photo-1582582429416-8ae3e7733bd8?auto=format&fit=crop&w=1200&q=80",
              alt: "Storage baskets on shelves",
            },
          ],
        },
        {
          slug: "almari-led-strip-5m",
          title: "Ambient LED Strip (5m)",
          description:
            "Warm, cozy lighting for bedrooms and desks. USB powered with multiple modes.",
          price: npr(89900),
          stock: 120,
          images: [
            {
              url: "https://images.unsplash.com/photo-1550534791-2677533605ab?auto=format&fit=crop&w=1200&q=80",
              alt: "LED lighting in a room",
            },
          ],
        },
      ],
    },
    {
      slug: "fashion",
      name: "Fashion",
      imageUrl:
        "https://images.unsplash.com/photo-1520975958225-8f025239d7b3?auto=format&fit=crop&w=1200&q=80",
      products: [
        {
          slug: "almari-everyday-tee",
          title: "Almari Everyday Tee",
          description:
            "Soft cotton tee with a clean fit. Easy to pair with anything.",
          price: npr(79900),
          stock: 150,
          images: [
            {
              url: "https://images.unsplash.com/photo-1520975867597-0f1d5c9bff91?auto=format&fit=crop&w=1200&q=80",
              alt: "Minimal t-shirt on hanger",
            },
          ],
        },
        {
          slug: "almari-urban-sneakers",
          title: "Almari Urban Sneakers",
          description:
            "Daily sneakers with cushioned insole and durable outsole for city walks.",
          price: npr(2599900),
          compareAtPrice: npr(3199900),
          stock: 45,
          images: [
            {
              url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
              alt: "Sneakers on a colorful background",
            },
          ],
        },
      ],
    },
    {
      slug: "beauty",
      name: "Health & Beauty",
      imageUrl:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      products: [
        {
          slug: "almari-skincare-kit",
          title: "Almari Skincare Starter Kit",
          description:
            "Cleanser, moisturizer, and sunscreen. Simple routine for daily glow.",
          price: npr(1999900),
          stock: 30,
          images: [
            {
              url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80",
              alt: "Skincare products on a surface",
            },
          ],
        },
      ],
    },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        imageUrl: category.imageUrl,
      },
      create: {
        slug: category.slug,
        name: category.name,
        imageUrl: category.imageUrl,
      },
    });

    for (const product of category.products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          title: product.title,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          categoryId: createdCategory.id,
          images: {
            deleteMany: {},
            create: product.images.map((img, idx) => ({
              url: img.url,
              alt: img.alt,
              position: idx,
            })),
          },
        },
        create: {
          slug: product.slug,
          title: product.title,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          categoryId: createdCategory.id,
          images: {
            create: product.images.map((img, idx) => ({
              url: img.url,
              alt: img.alt,
              position: idx,
            })),
          },
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    throw e;
  });

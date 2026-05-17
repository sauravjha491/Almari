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
    icon: string;
    imageUrl: string;
    products: SeedProduct[];
  }> = [
    {
      slug: "vehicles",
      name: "Vehicles",
      icon: "⛟",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "properties",
      name: "Properties",
      icon: "🏙",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "mobile-phones",
      name: "Mobile phones & Accessories",
      icon: "📱",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "electronics",
      name: "Electronics & Home Appliances",
      icon: "💻",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      products: [
        {
          slug: "almari-buds-pro",
          title: "Almari Buds Pro",
          description: "Wireless earbuds with active noise cancellation.",
          price: npr(499900),
          stock: 60,
          images: [{ url: "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=1200&q=80", alt: "Buds" }],
        },
      ],
    },
    {
      slug: "home-garden",
      name: "Home & Garden",
      icon: "🔐",
      imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "health-beauty",
      name: "Health & Beauty",
      icon: "💄",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "pets",
      name: "Pets",
      icon: "🐇",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "kids-babies",
      name: "Kids & Babies",
      icon: "👗",
      imageUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "groceries",
      name: "Groceries",
      icon: "🥣",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "sporting-goods",
      name: "Sporting Goods & Bikes",
      icon: "🎮",
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "hobbies-music",
      name: "Hobbies, Music, Art & Books",
      icon: "📚",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "business-industrial",
      name: "Business & Industrial",
      icon: "🛠",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "furnitures",
      name: "Furnitures",
      icon: "💺",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "constructions",
      name: "Constructions",
      icon: "🔨",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "women-fashion",
      name: "Women's Fashion",
      icon: "👜",
      imageUrl: "https://images.unsplash.com/photo-1520975958225-8f025239d7b3?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
    {
      slug: "men-fashion",
      name: "Men's Fashion",
      icon: "👓",
      imageUrl: "https://images.unsplash.com/photo-1520975867597-0f1d5c9bff91?auto=format&fit=crop&w=1200&q=80",
      products: [],
    },
  ];

  // Upsert categories
  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        imageUrl: category.imageUrl,
      },
      create: {
        slug: category.slug,
        name: category.name,
        icon: category.icon,
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

  // Create an Admin user
  await prisma.user.upsert({
    where: { email: "admin@almari.com" },
    update: {},
    create: {
      email: "admin@almari.com",
      name: "Admin User",
      password: "adminpassword", // In real app, use hashing
      role: "ADMIN",
    },
  });

  console.log("Seed successful");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  deleteProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import { IPricingModuleService } from "@medusajs/types";

import { BRAND_MODULE } from "../modules/brand";
import BrandModuleService from "../modules/brand/service";
import productBrandLink from "../links/product-brand";

type CategorySpec = {
  name: string;
  handle: string;
  parent?: string;
  reuseHandle?: string;
};

type ProductKind = "accessory" | "clothing" | "shoes";

type ProductSpec = {
  title: string;
  subtitle: string;
  handle: string;
  description: string;
  brand: "nike" | "adidas" | "puma" | "uniqlo";
  origin: "us" | "de" | "jp";
  category: string;
  eur: number;
  vnd: number;
  kind: ProductKind;
};

type CatalogProduct = {
  id: string;
  handle: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  origin_country: string | null;
  status: string;
  shipping_profile: { id: string } | null;
  categories: Array<{ id: string }>;
  sales_channels: Array<{ id: string }>;
  variants: Array<{
    id: string;
    price_set: {
      id: string;
      prices: Array<{ currency_code: string; amount: number }>;
    };
  }>;
};

type CatalogCategory = {
  id: string;
  name: string;
  handle: string;
  parent_category_id: string | null;
};

type Result = {
  before: { products: number; categories: number; brand_links: number };
  after: { products: number; categories: number; brand_links: number };
  created: { products: number; categories: number; brand_links: number };
  updated: { products: number; categories: number; variant_prices: number };
  skipped: {
    products: number;
    categories: number;
    brand_links: number;
    variant_prices: number;
  };
  warnings: string[];
};

const CATEGORY_SPECS: CategorySpec[] = [
  { name: "Fashion", handle: "fashion" },
  { name: "Men's Fashion", handle: "mens-fashion", parent: "fashion" },
  { name: "Men's Shoes", handle: "mens-shoes", parent: "mens-fashion" },
  { name: "Women's Fashion", handle: "womens-fashion", parent: "fashion" },
  {
    name: "Women's Shoes",
    handle: "womens-shoes",
    parent: "womens-fashion",
  },

  { name: "Shirts", handle: "shirts", parent: "fashion" },
  { name: "Men's T-Shirts", handle: "mens-t-shirts", parent: "shirts" },
  { name: "Women's T-Shirts", handle: "womens-t-shirts", parent: "shirts" },
  {
    name: "Oversized T-Shirts",
    handle: "oversized-t-shirts",
    parent: "shirts",
  },
  { name: "Polo Shirts", handle: "polo-shirts", parent: "shirts" },
  {
    name: "Long Sleeve Shirts",
    handle: "long-sleeve-shirts",
    parent: "shirts",
  },

  { name: "Sweatshirts", handle: "sweatshirts", parent: "fashion" },
  { name: "Hoodies", handle: "hoodies", parent: "sweatshirts" },
  {
    name: "Crewneck Sweatshirts",
    handle: "crewneck-sweatshirts",
    parent: "sweatshirts",
  },
  {
    name: "Men's Sweatshirts",
    handle: "mens-sweatshirts",
    parent: "sweatshirts",
  },
  {
    name: "Women's Sweatshirts",
    handle: "womens-sweatshirts",
    parent: "sweatshirts",
    reuseHandle: "womens-hoodies",
  },
  { name: "Zip Hoodies", handle: "zip-hoodies", parent: "sweatshirts" },

  { name: "Pants", handle: "pants", parent: "fashion" },
  { name: "Jeans", handle: "jeans", parent: "pants" },
  { name: "Trousers", handle: "trousers", parent: "pants" },
  { name: "Joggers", handle: "joggers", parent: "pants" },
  { name: "Shorts", handle: "shorts", parent: "pants" },
  { name: "Sports Pants", handle: "sports-pants", parent: "pants" },

  { name: "Accessories", handle: "accessories", parent: "fashion" },
  { name: "Bags", handle: "bags", parent: "accessories" },
  { name: "Hats", handle: "hats", parent: "accessories" },
  { name: "Eyewear", handle: "eyewear", parent: "accessories" },
  { name: "Wallets", handle: "wallets", parent: "accessories" },
  { name: "Belts", handle: "belts", parent: "accessories" },
  { name: "Shoes", handle: "shoes" },
  { name: "Sneakers", handle: "sneakers", parent: "shoes" },
  { name: "Running Shoes", handle: "running-shoes", parent: "shoes" },
  { name: "Slides", handle: "slides", parent: "shoes" },
  { name: "Watches", handle: "watches" },
  { name: "Men's Watches", handle: "mens-watches", parent: "watches" },
  { name: "Women's Watches", handle: "womens-watches", parent: "watches" },
  { name: "Smart Watches", handle: "smart-watches", parent: "watches" },
];

const SHOWCASE_PARENT_HANDLES = new Set([
  "shirts",
  "sweatshirts",
  "pants",
  "accessories",
]);

const PRODUCTS: ProductSpec[] = [
  {
    title: "Nike Air Max 270",
    subtitle: "Men's Lifestyle Shoes",
    handle: "nike-air-max-270",
    origin: "us",
    brand: "nike",
    category: "sneakers",
    eur: 119,
    vnd: 3290000,
    kind: "shoes",
    description:
      "Lightweight everyday sneakers designed for comfortable casual wear.",
  },
  {
    title: "Nike Club Fleece Hoodie",
    subtitle: "Men's Fleece Hoodie",
    handle: "nike-club-fleece-hoodie",
    origin: "us",
    brand: "nike",
    category: "hoodies",
    eur: 79,
    vnd: 1990000,
    kind: "clothing",
    description: "A soft fleece hoodie made for comfortable everyday layering.",
  },
  {
    title: "Nike Dri-FIT T-Shirt",
    subtitle: "Men's Training T-Shirt",
    handle: "nike-dri-fit-t-shirt",
    origin: "us",
    brand: "nike",
    category: "mens-t-shirts",
    eur: 35,
    vnd: 790000,
    kind: "clothing",
    description: "A breathable training shirt designed for active daily wear.",
  },
  {
    title: "Nike Pegasus Running Shoes",
    subtitle: "Men's Running Shoes",
    handle: "nike-pegasus-running-shoes",
    origin: "us",
    brand: "nike",
    category: "running-shoes",
    eur: 130,
    vnd: 3490000,
    kind: "shoes",
    description:
      "Responsive running shoes designed for comfortable daily training.",
  },
  {
    title: "Nike Sportswear Club Pants",
    subtitle: "Men's Casual Pants",
    handle: "nike-sportswear-club-pants",
    origin: "us",
    brand: "nike",
    category: "sports-pants",
    eur: 60,
    vnd: 1490000,
    kind: "clothing",
    description: "Relaxed casual pants with a simple everyday fit.",
  },
  {
    title: "Adidas Samba OG",
    subtitle: "Classic Lifestyle Shoes",
    handle: "adidas-samba-og",
    origin: "de",
    brand: "adidas",
    category: "sneakers",
    eur: 120,
    vnd: 3190000,
    kind: "shoes",
    description:
      "Low-profile lifestyle shoes with a timeless casual silhouette.",
  },
  {
    title: "Adidas Essentials Hoodie",
    subtitle: "Unisex Essentials Hoodie",
    handle: "adidas-essentials-hoodie",
    origin: "de",
    brand: "adidas",
    category: "hoodies",
    eur: 70,
    vnd: 1790000,
    kind: "clothing",
    description: "A versatile hoodie designed for relaxed everyday comfort.",
  },
  {
    title: "Adidas Adilette Slides",
    subtitle: "Unisex Comfort Slides",
    handle: "adidas-adilette-slides",
    origin: "de",
    brand: "adidas",
    category: "slides",
    eur: 40,
    vnd: 890000,
    kind: "shoes",
    description: "Easy slip-on slides with a comfortable everyday footbed.",
  },
  {
    title: "Adidas Ultraboost Light",
    subtitle: "Running Shoes",
    handle: "adidas-ultraboost-light",
    origin: "de",
    brand: "adidas",
    category: "running-shoes",
    eur: 180,
    vnd: 4490000,
    kind: "shoes",
    description: "Cushioned running shoes designed for energetic daily miles.",
  },
  {
    title: "Adidas Essentials T-Shirt",
    subtitle: "Men's Cotton T-Shirt",
    handle: "adidas-essentials-t-shirt",
    origin: "de",
    brand: "adidas",
    category: "mens-t-shirts",
    eur: 30,
    vnd: 690000,
    kind: "clothing",
    description: "A clean cotton T-shirt for simple everyday outfits.",
  },
  {
    title: "Puma Suede Classic",
    subtitle: "Classic Lifestyle Shoes",
    handle: "puma-suede-classic",
    origin: "de",
    brand: "puma",
    category: "sneakers",
    eur: 85,
    vnd: 2190000,
    kind: "shoes",
    description: "Classic casual sneakers with a soft textured upper.",
  },
  {
    title: "Puma Essentials Tee",
    subtitle: "Men's Essentials T-Shirt",
    handle: "puma-essentials-tee",
    origin: "de",
    brand: "puma",
    category: "mens-t-shirts",
    eur: 30,
    vnd: 690000,
    kind: "clothing",
    description: "A comfortable essential tee with a straightforward fit.",
  },
  {
    title: "Puma RS-X Sneakers",
    subtitle: "Men's Lifestyle Sneakers",
    handle: "puma-rs-x-sneakers",
    origin: "de",
    brand: "puma",
    category: "sneakers",
    eur: 110,
    vnd: 2790000,
    kind: "shoes",
    description: "Bold lifestyle sneakers built for comfortable city wear.",
  },
  {
    title: "Puma Essentials Hoodie",
    subtitle: "Men's Casual Hoodie",
    handle: "puma-essentials-hoodie",
    origin: "de",
    brand: "puma",
    category: "hoodies",
    eur: 65,
    vnd: 1590000,
    kind: "clothing",
    description: "A casual hoodie with a soft feel and easy silhouette.",
  },
  {
    title: "Puma Running Pants",
    subtitle: "Men's Training Pants",
    handle: "puma-running-pants",
    origin: "de",
    brand: "puma",
    category: "sports-pants",
    eur: 55,
    vnd: 1290000,
    kind: "clothing",
    description:
      "Light training pants designed for movement and daily comfort.",
  },
  {
    title: "UNIQLO AIRism Cotton Oversized T-Shirt",
    subtitle: "Unisex AIRism T-Shirt",
    handle: "uniqlo-airism-oversized-t-shirt",
    origin: "jp",
    brand: "uniqlo",
    category: "oversized-t-shirts",
    eur: 20,
    vnd: 499000,
    kind: "clothing",
    description: "An oversized everyday shirt with a smooth lightweight feel.",
  },
  {
    title: "UNIQLO Supima Cotton Crew Neck T-Shirt",
    subtitle: "Men's Cotton T-Shirt",
    handle: "uniqlo-supima-cotton-t-shirt",
    origin: "jp",
    brand: "uniqlo",
    category: "mens-t-shirts",
    eur: 20,
    vnd: 499000,
    kind: "clothing",
    description: "A soft cotton crew-neck shirt for everyday use.",
  },
  {
    title: "UNIQLO Sweat Pullover Hoodie",
    subtitle: "Unisex Pullover Hoodie",
    handle: "uniqlo-sweat-pullover-hoodie",
    origin: "jp",
    brand: "uniqlo",
    category: "hoodies",
    eur: 40,
    vnd: 999000,
    kind: "clothing",
    description: "A simple pullover hoodie made for comfortable layering.",
  },
  {
    title: "UNIQLO Wide Straight Jeans",
    subtitle: "Unisex Wide-Leg Jeans",
    handle: "uniqlo-wide-straight-jeans",
    origin: "jp",
    brand: "uniqlo",
    category: "jeans",
    eur: 50,
    vnd: 1290000,
    kind: "clothing",
    description: "Wide straight-leg jeans with a relaxed contemporary shape.",
  },
  {
    title: "UNIQLO Smart Ankle Pants",
    subtitle: "Men's Ankle Pants",
    handle: "uniqlo-smart-ankle-pants",
    origin: "jp",
    brand: "uniqlo",
    category: "trousers",
    eur: 40,
    vnd: 999000,
    kind: "clothing",
    description: "Clean ankle-length pants suited to casual and smart outfits.",
  },
  {
    title: "UNIQLO Women's Cotton T-Shirt",
    subtitle: "Women's Everyday T-Shirt",
    handle: "uniqlo-womens-cotton-t-shirt",
    origin: "jp",
    brand: "uniqlo",
    category: "womens-t-shirts",
    eur: 20,
    vnd: 499000,
    kind: "clothing",
    description:
      "A soft cotton T-shirt designed for comfortable everyday wear.",
  },
  {
    title: "UNIQLO Dry Pique Polo Shirt",
    subtitle: "Men's Polo Shirt",
    handle: "uniqlo-dry-pique-polo-shirt",
    origin: "jp",
    brand: "uniqlo",
    category: "polo-shirts",
    eur: 30,
    vnd: 699000,
    kind: "clothing",
    description: "A breathable pique polo with a clean everyday silhouette.",
  },
  {
    title: "UNIQLO Soft Touch Long Sleeve T-Shirt",
    subtitle: "Men's Long Sleeve T-Shirt",
    handle: "uniqlo-soft-touch-long-sleeve-t-shirt",
    origin: "jp",
    brand: "uniqlo",
    category: "long-sleeve-shirts",
    eur: 30,
    vnd: 699000,
    kind: "clothing",
    description: "A soft long-sleeve shirt for comfortable daily layering.",
  },
  {
    title: "Nike Club Crew Sweatshirt",
    subtitle: "Men's Crewneck Sweatshirt",
    handle: "nike-club-crew-sweatshirt",
    origin: "us",
    brand: "nike",
    category: "crewneck-sweatshirts",
    eur: 65,
    vnd: 1590000,
    kind: "clothing",
    description: "A classic crewneck sweatshirt with a soft casual feel.",
  },
  {
    title: "Puma Men's Essential Sweatshirt",
    subtitle: "Men's Casual Sweatshirt",
    handle: "puma-mens-essential-sweatshirt",
    origin: "de",
    brand: "puma",
    category: "mens-sweatshirts",
    eur: 60,
    vnd: 1490000,
    kind: "clothing",
    description: "An easy everyday sweatshirt with a relaxed men's fit.",
  },
  {
    title: "UNIQLO Women's Sweatshirt",
    subtitle: "Women's Casual Sweatshirt",
    handle: "uniqlo-womens-sweatshirt",
    origin: "jp",
    brand: "uniqlo",
    category: "womens-sweatshirts",
    eur: 40,
    vnd: 999000,
    kind: "clothing",
    description: "A simple women's sweatshirt made for everyday comfort.",
  },
  {
    title: "Nike Sportswear Full-Zip Hoodie",
    subtitle: "Men's Zip Hoodie",
    handle: "nike-sportswear-full-zip-hoodie",
    origin: "us",
    brand: "nike",
    category: "zip-hoodies",
    eur: 80,
    vnd: 1990000,
    kind: "clothing",
    description: "A versatile full-zip hoodie for comfortable layering.",
  },
  {
    title: "Adidas Essentials Joggers",
    subtitle: "Men's Casual Joggers",
    handle: "adidas-essentials-joggers",
    origin: "de",
    brand: "adidas",
    category: "joggers",
    eur: 55,
    vnd: 1390000,
    kind: "clothing",
    description: "Relaxed joggers designed for casual everyday movement.",
  },
  {
    title: "Nike Club Shorts",
    subtitle: "Men's Casual Shorts",
    handle: "nike-club-shorts",
    origin: "us",
    brand: "nike",
    category: "shorts",
    eur: 40,
    vnd: 990000,
    kind: "clothing",
    description: "Comfortable casual shorts with a clean athletic look.",
  },
  {
    title: "UNIQLO Round Mini Shoulder Bag",
    subtitle: "Everyday Shoulder Bag",
    handle: "uniqlo-round-mini-shoulder-bag",
    origin: "jp",
    brand: "uniqlo",
    category: "bags",
    eur: 20,
    vnd: 499000,
    kind: "accessory",
    description: "A compact shoulder bag for practical everyday essentials.",
  },
  {
    title: "Nike Club Cap",
    subtitle: "Unisex Sports Cap",
    handle: "nike-club-cap",
    origin: "us",
    brand: "nike",
    category: "hats",
    eur: 25,
    vnd: 590000,
    kind: "accessory",
    description: "A lightweight sports cap with a classic casual shape.",
  },
  {
    title: "Puma Lifestyle Sunglasses",
    subtitle: "Unisex Sunglasses",
    handle: "puma-lifestyle-sunglasses",
    origin: "de",
    brand: "puma",
    category: "eyewear",
    eur: 45,
    vnd: 1090000,
    kind: "accessory",
    description: "Versatile sunglasses with a clean everyday frame.",
  },
  {
    title: "Adidas Essentials Wallet",
    subtitle: "Everyday Wallet",
    handle: "adidas-essentials-wallet",
    origin: "de",
    brand: "adidas",
    category: "wallets",
    eur: 25,
    vnd: 590000,
    kind: "accessory",
    description: "A compact wallet for carrying everyday essentials.",
  },
  {
    title: "Puma Classic Belt",
    subtitle: "Unisex Casual Belt",
    handle: "puma-classic-belt",
    origin: "de",
    brand: "puma",
    category: "belts",
    eur: 30,
    vnd: 690000,
    kind: "accessory",
    description: "A simple casual belt with a versatile everyday finish.",
  },
  {
    title: "UNIQLO Ultra Light Down Jacket",
    subtitle: "Men's Lightweight Down Jacket",
    handle: "uniqlo-ultra-light-down-jacket",
    origin: "jp",
    brand: "uniqlo",
    category: "mens-fashion",
    eur: 80,
    vnd: 1990000,
    kind: "clothing",
    description: "A lightweight insulated jacket designed for easy layering.",
  },
];

const listProducts = async (container: MedusaContainer) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "handle",
      "title",
      "subtitle",
      "description",
      "origin_country",
      "status",
      "shipping_profile.id",
      "categories.id",
      "sales_channels.id",
      "variants.id",
      "variants.price_set.id",
      "variants.price_set.prices.currency_code",
      "variants.price_set.prices.amount",
    ],
  });
  return data as CatalogProduct[];
};

const listCategories = async (container: MedusaContainer) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "parent_category_id"],
  });
  return data as CatalogCategory[];
};

const listBrandLinks = async (container: MedusaContainer) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: productBrandLink.entryPoint,
    fields: ["product_id", "brand_id"],
  });
  return data as Array<{ product_id: string; brand_id: string }>;
};

const getCounts = async (container: MedusaContainer) => ({
  products: (await listProducts(container)).length,
  categories: (await listCategories(container)).length,
  brand_links: (await listBrandLinks(container)).length,
});

const ensureCategories = async (container: MedusaContainer, result: Result) => {
  const categories = await listCategories(container);
  const byHandle = new Map(
    categories.map((category) => [category.handle, category]),
  );
  const resolved = new Map<string, CatalogCategory>();

  for (const spec of CATEGORY_SPECS) {
    let existing =
      byHandle.get(spec.handle) ||
      (spec.reuseHandle ? byHandle.get(spec.reuseHandle) : undefined);
    const parent = spec.parent ? resolved.get(spec.parent) : undefined;

    if (!existing) {
      const { result: created } = await createProductCategoriesWorkflow(
        container,
      ).run({
        input: {
          product_categories: [
            {
              name: spec.name,
              handle: spec.handle,
              is_active: true,
              parent_category_id: parent?.id,
            },
          ],
        },
      });
      const category = created[0] as CatalogCategory;
      resolved.set(spec.handle, category);
      byHandle.set(category.handle, category);
      result.created.categories++;
      continue;
    }

    if (existing.handle !== spec.handle || existing.name !== spec.name) {
      const { result: updated } = await updateProductCategoriesWorkflow(
        container,
      ).run({
        input: {
          selector: { id: existing.id },
          update: { handle: spec.handle, name: spec.name },
        },
      });
      existing = updated[0] as CatalogCategory;
      byHandle.set(spec.handle, existing);
      result.updated.categories++;
    }

    if (parent && existing.parent_category_id !== parent.id) {
      const { result: updated } = await updateProductCategoriesWorkflow(
        container,
      ).run({
        input: {
          selector: { id: existing.id },
          update: { parent_category_id: parent.id },
        },
      });
      resolved.set(spec.handle, updated[0] as CatalogCategory);
      result.updated.categories++;
      continue;
    }

    resolved.set(spec.handle, existing);
    result.skipped.categories++;
  }
  return resolved;
};

const migrateLegacyMerchCategory = async (
  container: MedusaContainer,
  result: Result,
) => {
  const categories = await listCategories(container);
  const legacy = categories.find(({ handle }) => handle === "merch");
  const accessories = categories.find(({ handle }) => handle === "accessories");

  if (!legacy) return;

  if (!accessories) {
    await updateProductCategoriesWorkflow(container).run({
      input: {
        selector: { id: legacy.id },
        update: { name: "Accessories", handle: "accessories" },
      },
    });
    result.updated.categories++;
    return;
  }

  const legacyChildren = categories.filter(
    ({ parent_category_id }) => parent_category_id === legacy.id,
  );
  if (legacyChildren.length) {
    throw new Error(
      `Legacy Merch Category still has child Categories: ${legacyChildren
        .map(({ handle }) => handle)
        .join(", ")}`,
    );
  }

  const legacyProducts = (await listProducts(container)).filter((product) =>
    product.categories.some(({ id }) => id === legacy.id),
  );
  for (const product of legacyProducts) {
    const categoryIds = product.categories
      .map(({ id }) => id)
      .filter((id) => id !== legacy.id);
    await updateProductsWorkflow(container).run({
      input: {
        products: [
          {
            id: product.id,
            category_ids: [...new Set([...categoryIds, accessories.id])],
          },
        ],
      },
    });
    result.updated.products++;
  }

  await deleteProductCategoriesWorkflow(container).run({
    input: [legacy.id],
  });
  result.updated.categories++;
};

const ensureShoeSizeOption = async (container: MedusaContainer) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "product_option",
    fields: ["id", "title"],
  });
  const existing = (data as Array<{ id: string; title: string }>).find(
    (option) => option.title === "Shoe Size",
  );
  if (existing) return existing.id;
  const { result } = await createProductOptionsWorkflow(container).run({
    input: {
      product_options: [
        { title: "Shoe Size", values: ["40", "41", "42", "43"] },
      ],
    },
  });
  return result[0].id;
};

const buildVariants = (
  spec: ProductSpec,
  sizeOptionId: string,
  colorOptionId: string,
  shoeSizeOptionId: string,
) => {
  if (spec.kind === "accessory") {
    return [
      {
        title: "Default",
        sku: `${spec.handle}-DEFAULT`.toUpperCase(),
        manage_inventory: false,
        options: { Color: "Black" },
        prices: [
          { currency_code: "eur", amount: spec.eur },
          { currency_code: "vnd", amount: spec.vnd },
        ],
        _optionIds: [colorOptionId],
      },
    ];
  }

  const sizes =
    spec.kind === "shoes" ? ["40", "41", "42", "43"] : ["S", "M", "L", "XL"];
  const colors = spec.kind === "shoes" ? ["Black"] : ["Black", "White"];
  const optionTitle = spec.kind === "shoes" ? "Shoe Size" : "Size";
  const optionId = spec.kind === "shoes" ? shoeSizeOptionId : sizeOptionId;

  return sizes.flatMap((size) =>
    colors.map((color) => ({
      title: `${size} / ${color}`,
      sku: `${spec.handle}-${size}-${color}`.toUpperCase(),
      manage_inventory: false,
      options: { [optionTitle]: size, Color: color },
      prices: [
        { currency_code: "eur", amount: spec.eur },
        { currency_code: "vnd", amount: spec.vnd },
      ],
      _optionIds: [optionId, colorOptionId],
    })),
  );
};

export default async function setupDemoCatalog({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const pricingService = container.resolve<IPricingModuleService>(
    Modules.PRICING,
  );
  const brandService: BrandModuleService = container.resolve(BRAND_MODULE);

  const result: Result = {
    before: await getCounts(container),
    after: { products: 0, categories: 0, brand_links: 0 },
    created: { products: 0, categories: 0, brand_links: 0 },
    updated: { products: 0, categories: 0, variant_prices: 0 },
    skipped: { products: 0, categories: 0, brand_links: 0, variant_prices: 0 },
    warnings: [],
  };

  const { data: channels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const defaultChannel = (channels as Array<{ id: string; name: string }>).find(
    (channel) => channel.name === "Default Sales Channel",
  );
  const { data: profiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name", "type"],
  });
  const defaultProfile = (
    profiles as Array<{ id: string; name: string; type: string }>
  ).find((profile) => profile.type === "default");
  const { data: options } = await query.graph({
    entity: "product_option",
    fields: ["id", "title"],
  });
  const sizeOption = (options as Array<{ id: string; title: string }>).find(
    (option) => option.title === "Size",
  );
  const colorOption = (options as Array<{ id: string; title: string }>).find(
    (option) => option.title === "Color",
  );
  const brands = await brandService.listBrands({
    handle: ["nike", "adidas", "puma", "uniqlo"],
  });

  if (!defaultChannel || !defaultProfile || !sizeOption || !colorOption) {
    throw new Error(
      "Default sales channel, shipping profile, Size, or Color option is missing.",
    );
  }
  const brandsByHandle = new Map(brands.map((brand) => [brand.handle, brand]));
  for (const handle of ["nike", "adidas", "puma", "uniqlo"]) {
    if (!brandsByHandle.has(handle))
      throw new Error(`Required Brand ${handle} is missing.`);
  }

  await migrateLegacyMerchCategory(container, result);
  const categories = await ensureCategories(container, result);
  const shoeSizeOptionId = await ensureShoeSizeOption(container);
  let products = await listProducts(container);
  const existingHandles = new Set(products.map((product) => product.handle));

  for (const spec of PRODUCTS.filter(
    (product) => !existingHandles.has(product.handle),
  )) {
    const category = categories.get(spec.category);
    if (!category)
      throw new Error(`Category ${spec.category} was not resolved.`);
    const variants = buildVariants(
      spec,
      sizeOption.id,
      colorOption.id,
      shoeSizeOptionId,
    );
    const attachedOptionIds = [
      ...new Set(variants.flatMap((variant) => variant._optionIds)),
    ];

    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: spec.title,
            subtitle: spec.subtitle,
            description: spec.description,
            handle: spec.handle,
            origin_country: spec.origin,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: defaultProfile.id,
            categories: [{ id: category.id }],
            sales_channels: [{ id: defaultChannel.id }],
            options: attachedOptionIds.map((id) => ({ id })),
            variants: variants.map(({ _optionIds: _, ...variant }) => variant),
          },
        ],
      } as any,
    });
    result.created.products++;
  }

  products = await listProducts(container);
  const productsByHandle = new Map(
    products.map((product) => [product.handle, product]),
  );

  for (const spec of PRODUCTS) {
    const product = productsByHandle.get(spec.handle)!;
    const category = categories.get(spec.category)!;
    const parentCategory = CATEGORY_SPECS.find(
      (candidate) => candidate.handle === spec.category,
    )?.parent;
    const parent =
      parentCategory && SHOWCASE_PARENT_HANDLES.has(parentCategory)
        ? categories.get(parentCategory)
        : undefined;
    const categoryIds = new Set(product.categories.map(({ id }) => id));
    const channelIds = new Set(product.sales_channels.map(({ id }) => id));
    const needsUpdate =
      product.origin_country?.toLowerCase() !== spec.origin ||
      product.status !== ProductStatus.PUBLISHED ||
      product.shipping_profile?.id !== defaultProfile.id ||
      !categoryIds.has(category.id) ||
      (!!parent && !categoryIds.has(parent.id)) ||
      !channelIds.has(defaultChannel.id);

    if (needsUpdate) {
      await updateProductsWorkflow(container).run({
        input: {
          products: [
            {
              id: product.id,
              origin_country: spec.origin,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: defaultProfile.id,
              category_ids: [
                ...new Set([
                  ...categoryIds,
                  category.id,
                  ...(parent ? [parent.id] : []),
                ]),
              ],
              sales_channels: [
                ...new Set([...channelIds, defaultChannel.id]),
              ].map((id) => ({ id })),
            },
          ],
        },
      });
      result.updated.products++;
    } else {
      result.skipped.products++;
    }
  }

  products = await listProducts(container);
  for (const spec of PRODUCTS) {
    const product = products.find(({ handle }) => handle === spec.handle)!;
    for (const variant of product.variants) {
      const currencies = new Set(
        variant.price_set.prices.map(({ currency_code }) =>
          currency_code.toLowerCase(),
        ),
      );
      const missing = [
        ...(currencies.has("eur")
          ? []
          : [{ currency_code: "eur", amount: spec.eur }]),
        ...(currencies.has("vnd")
          ? []
          : [{ currency_code: "vnd", amount: spec.vnd }]),
      ];
      if (missing.length) {
        await pricingService.addPrices([
          { priceSetId: variant.price_set.id, prices: missing },
        ]);
        result.updated.variant_prices += missing.length;
      } else {
        result.skipped.variant_prices += 2;
      }
    }
  }

  const existingLinks = await listBrandLinks(container);
  const brandIdByProductId = new Map(
    existingLinks.map((brandLink) => [
      brandLink.product_id,
      brandLink.brand_id,
    ]),
  );
  for (const spec of PRODUCTS) {
    const product = products.find(({ handle }) => handle === spec.handle)!;
    const brand = brandsByHandle.get(spec.brand)!;
    const existingBrandId = brandIdByProductId.get(product.id);
    if (existingBrandId === brand.id) {
      result.skipped.brand_links++;
    } else if (existingBrandId) {
      result.warnings.push(
        `Product ${spec.handle} is linked to another Brand; left unchanged.`,
      );
    } else {
      await link.create({
        [Modules.PRODUCT]: { product_id: product.id },
        [BRAND_MODULE]: { brand_id: brand.id },
      });
      result.created.brand_links++;
    }
  }

  result.after = await getCounts(container);
  logger.info(`DEMO_CATALOG_RESULT ${JSON.stringify(result)}`);
}

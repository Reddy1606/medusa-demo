export type CategoryShowcaseConfig = {
  handle: string
  title: string
  description: string
  image?: string
  childLabels: Record<string, string>
}

export const CATEGORY_SHOWCASES: CategoryShowcaseConfig[] = [
  {
    handle: "shirts",
    title: "Áo thun tuyển chọn",
    description: "Những thiết kế linh hoạt cho phong cách hằng ngày.",
    image: "/images/categories/shirts.png",
    childLabels: {
      "mens-t-shirts": "Áo thun nam",
      "womens-t-shirts": "Áo thun nữ",
      "oversized-t-shirts": "Oversized",
      "polo-shirts": "Polo",
      "long-sleeve-shirts": "Áo dài tay",
    },
  },
  {
    handle: "sweatshirts",
    title: "Áo nỉ hiện đại",
    description: "Thoải mái, ấm áp và dễ dàng phối hợp.",
    image: "/images/categories/sweatshirts.jpg",
    childLabels: {
      hoodies: "Hoodie",
      "crewneck-sweatshirts": "Áo nỉ cổ tròn",
      "mens-sweatshirts": "Áo nỉ nam",
      "womens-sweatshirts": "Áo nỉ nữ",
      "zip-hoodies": "Zip Hoodie",
    },
  },
  {
    handle: "pants",
    title: "Quần phong cách",
    description: "Hoàn thiện trang phục với những lựa chọn thiết thực.",
    image: "/images/categories/pants.jpg",
    childLabels: {
      jeans: "Jeans",
      trousers: "Quần dài",
      joggers: "Jogger",
      shorts: "Quần short",
      "sports-pants": "Quần thể thao",
    },
  },
  {
    handle: "accessories",
    title: "Phụ kiện",
    description: "Những món đồ nhỏ tạo nên dấu ấn riêng.",
    image: "/images/categories/accessories.jpg",
    childLabels: {
      bags: "Túi xách",
      hats: "Mũ",
      eyewear: "Kính mắt",
      wallets: "Ví",
      belts: "Thắt lưng",
    },
  },
]

import { CATEGORY_SHOWCASES } from "@lib/config/category-showcases"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import CategoryShowcase, { loadCategoryShowcase } from "./category-showcase"

export default async function CategoryShowcases({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const categories = await listCategories(
    {
      limit: 100,
      include_descendants_tree: true,
      fields: "id,name,handle,description,*category_children",
    },
    { cache: "no-store" },
  )
  const categoriesByHandle = new Map(
    categories.map((category) => [category.handle, category]),
  )

  const showcases = await Promise.all(
    CATEGORY_SHOWCASES.map((config) => {
      const category = categoriesByHandle.get(config.handle)
      return category
        ? loadCategoryShowcase(category, config, region)
        : Promise.resolve(null)
    }),
  )
  const availableShowcases = showcases.filter(
    (showcase): showcase is NonNullable<typeof showcase> => !!showcase,
  )

  if (!availableShowcases.length) return null

  return (
    <div className="bg-[#fffdf7] px-6" data-testid="category-showcases">
      <div className="mx-auto max-w-[1280px]">
        {availableShowcases.map((showcase) => (
          <CategoryShowcase key={showcase.category.id} {...showcase} />
        ))}
      </div>
    </div>
  )
}

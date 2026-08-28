import { listCategories } from "@lib/data/categories"
import { selectCategoryShowcases } from "@lib/util/category-showcases"
import { HttpTypes } from "@medusajs/types"
import CategoryShowcase, { loadCategoryShowcase } from "./category-showcase"

const CATEGORY_PRESENTATION_REVALIDATE_SECONDS = 60

export default async function CategoryShowcases({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const categories = await listCategories(
    {
      limit: 100,
      include_descendants_tree: true,
      fields: "id,name,handle,description,rank,metadata,*category_children",
    },
    {
      cache: "force-cache",
      revalidate: CATEGORY_PRESENTATION_REVALIDATE_SECONDS,
    }
  )
  const candidates = selectCategoryShowcases(categories)

  const showcases = await Promise.all(
    candidates.map(({ category, presentation }) =>
      loadCategoryShowcase(category, presentation, region)
    )
  )
  const availableShowcases = showcases.filter(
    (showcase): showcase is NonNullable<typeof showcase> => !!showcase
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

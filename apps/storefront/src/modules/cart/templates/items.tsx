import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  return (
    <div>
      <div className="flex items-center justify-between border-b pb-4">
        <Heading className="text-2xl font-semibold leading-tight">
          Giỏ hàng của bạn
        </Heading>

        <span className="text-sm text-ui-fg-subtle">
          {items?.length ?? 0} sản phẩm
        </span>
      </div>

      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="txt-medium-plus text-ui-fg-subtle">
            <Table.HeaderCell className="!pl-0">Sản phẩm</Table.HeaderCell>

            <Table.HeaderCell />

            <Table.HeaderCell>Số lượng</Table.HeaderCell>

            <Table.HeaderCell className="hidden small:table-cell">
              Đơn giá
            </Table.HeaderCell>

            <Table.HeaderCell className="!pr-0 text-right">
              Thành tiền
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items
            ? [...items]
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                ))
            : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate

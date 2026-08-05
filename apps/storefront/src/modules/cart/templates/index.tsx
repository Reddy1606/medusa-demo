import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <main className="tixi-page py-10 small:py-16">
      <div
        className="content-container mx-auto max-w-7xl"
        data-testid="cart-container"
      >
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Danh sách sản phẩm */}
            <div className="tixi-card p-4 xsmall:p-6 lg:col-span-2">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}

              <ItemsTemplate cart={cart} />
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="tixi-card h-fit p-6 lg:sticky lg:top-28">
              {cart.region && <Summary cart={cart} />}
            </div>
          </div>
        ) : (
          <div className="tixi-card p-8 small:p-12">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </main>
  )
}

export default CartTemplate

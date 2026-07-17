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
    <div className="min-h-screen bg-gray-100 py-10">
      <div
        className="content-container mx-auto max-w-7xl"
        data-testid="cart-container"
      >
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Danh sách sản phẩm */}
            <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}

              <ItemsTemplate cart={cart} />
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="h-fit rounded-xl border bg-white p-6 shadow-sm lg:sticky lg:top-6">
              {cart.region && <Summary cart={cart} />}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-10 shadow-sm">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
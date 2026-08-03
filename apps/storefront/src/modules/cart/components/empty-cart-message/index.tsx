import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center px-2 py-24 text-center"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        Giỏ hàng của bạn đang trống
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        Hãy khám phá những sản phẩm quốc tế được tuyển chọn và bắt đầu đơn hàng
        của bạn.
      </Text>
      <div>
        <InteractiveLink href="/store">Khám phá sản phẩm</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage

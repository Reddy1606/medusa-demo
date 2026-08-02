import type { FormEvent } from "react"

import { Button, Input } from "@modules/common/components/ui"

type TrackingFormProps = {
  isLoading: boolean
  onSubmit: (input: { email: string; phone: string }) => void
}

function isValidVietnamesePhone(value: string) {
  const compact = value.trim().replace(/[\s.()-]/g, "")
  let nationalNumber: string

  if (compact.startsWith("+84")) {
    nationalNumber = compact.slice(3)
  } else if (compact.startsWith("84")) {
    nationalNumber = compact.slice(2)
  } else if (compact.startsWith("0")) {
    nationalNumber = compact.slice(1)
  } else {
    return false
  }

  return /^[1-9]\d{8,9}$/.test(nationalNumber)
}

export default function TrackingForm({
  isLoading,
  onSubmit,
}: TrackingFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const phone = String(form.get("phone") ?? "").trim()
    const phoneInput = event.currentTarget.elements.namedItem(
      "phone"
    ) as HTMLInputElement

    phoneInput.setCustomValidity(
      isValidVietnamesePhone(phone)
        ? ""
        : "Vui lòng nhập số điện thoại Việt Nam hợp lệ."
    )

    if (!event.currentTarget.reportValidity()) {
      return
    }

    onSubmit({ email, phone })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="guest-order-email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        disabled={isLoading}
      />
      <Input
        id="guest-order-phone"
        name="phone"
        type="tel"
        label="Số điện thoại"
        autoComplete="tel"
        inputMode="tel"
        required
        disabled={isLoading}
        onChange={(event) => event.currentTarget.setCustomValidity("")}
      />
      <Button type="submit" size="large" isLoading={isLoading}>
        Tra cứu đơn hàng
      </Button>
    </form>
  )
}

import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button } from "@medusajs/ui";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const findCategoryActions = (anchor: HTMLElement) => {
  const page = anchor.parentElement;
  if (!page) return null;

  const createAction = page.querySelector<HTMLAnchorElement>(
    'a[href$="/categories/create"]',
  );
  const actions = createAction?.parentElement;

  return actions instanceof HTMLElement && createAction
    ? { actions, createAction }
    : null;
};

const CategoryHomepageOrderAction = () => {
  const navigate = useNavigate();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const target = findCategoryActions(anchor);
    if (!target) return;

    const host = document.createElement("span");
    host.style.display = "contents";
    host.dataset.homepageCategoryOrderAction = "true";
    target.actions.insertBefore(host, target.createAction);
    setPortalHost(host);

    return () => {
      setPortalHost(null);
      host.remove();
    };
  }, []);

  return (
    <>
      <span ref={anchorRef} className="hidden" aria-hidden="true" />
      {portalHost
        ? createPortal(
            <Button
              type="button"
              size="small"
              variant="secondary"
              onClick={() => navigate("/homepage-categories")}
            >
              Homepage order
            </Button>,
            portalHost,
          )
        : null}
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "product_category.list",
  id: "homepage-category-order-action",
});

export default CategoryHomepageOrderAction;

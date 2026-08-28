import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  ArrowDownMini,
  ArrowLeftMini,
  ArrowUpMini,
  BarsThree,
} from "@medusajs/icons";
import { Button, Container, Heading, Text, toast } from "@medusajs/ui";
import { DragEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomepageCategory,
  useHomepageCategories,
  useSaveHomepageCategoryOrder,
} from "../../hooks/api/homepage-categories";

const moveItem = <T,>(items: T[], from: number, to: number) => {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const HomepageCategoriesPage = () => {
  const navigate = useNavigate();
  const query = useHomepageCategories();
  const saveOrder = useSaveHomepageCategoryOrder();
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const categories = query.data ?? [];
  const persistedIds = useMemo(
    () => categories.map((category) => category.id),
    [categories],
  );

  useEffect(() => {
    setOrderedIds(persistedIds);
  }, [persistedIds]);

  const hasChanges =
    orderedIds.length === persistedIds.length &&
    orderedIds.some((id, index) => id !== persistedIds[index]);

  useEffect(() => {
    if (!hasChanges) return;

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasChanges]);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const orderedCategories = orderedIds
    .map((id) => categoryById.get(id))
    .filter((category): category is HomepageCategory => Boolean(category));

  const move = (id: string, direction: -1 | 1) => {
    setOrderedIds((current) => {
      const from = current.indexOf(id);
      const to = from + direction;
      return from < 0 || to < 0 || to >= current.length
        ? current
        : moveItem(current, from, to);
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDropTargetId(null);
      return;
    }

    setOrderedIds((current) => {
      const from = current.indexOf(draggedId);
      const to = current.indexOf(targetId);
      return from < 0 || to < 0 ? current : moveItem(current, from, to);
    });
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleSave = async () => {
    try {
      await saveOrder.mutateAsync(orderedIds);
      toast.success("Homepage Category order saved");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Homepage Category order could not be saved.",
      );
    }
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            type="button"
            variant="transparent"
            size="small"
            className="-ml-2 mb-1"
            onClick={() => navigate("/categories")}
          >
            <ArrowLeftMini /> Categories
          </Button>
          <Heading level="h1">Homepage Categories</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Categories &gt; Homepage order
          </Text>
          <Text size="small" className="text-ui-fg-subtle">
            Drag Categories into position or use the Move buttons, then save.
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasChanges && (
            <Text size="small" className="text-ui-fg-subtle">
              Unsaved order changes
            </Text>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOrderedIds(persistedIds)}
            disabled={!hasChanges || saveOrder.isPending}
          >
            Discard
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            isLoading={saveOrder.isPending}
            disabled={!hasChanges || saveOrder.isPending}
          >
            Save order
          </Button>
        </div>
      </div>

      {query.isLoading ? (
        <div className="px-6 py-16 text-center">
          <Text className="text-ui-fg-subtle">Loading Categories...</Text>
        </div>
      ) : query.isError ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <Heading level="h2">Categories could not be loaded</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {query.error instanceof Error
              ? query.error.message
              : "Refresh the page and try again."}
          </Text>
          <Button
            type="button"
            variant="secondary"
            onClick={() => query.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : orderedCategories.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Heading level="h2">No homepage Categories</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-2">
            Enable an active, public Category from its Homepage Presentation
            panel.
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-4 py-4 sm:px-6">
          {orderedCategories.map((category, index) => (
            <div
              key={category.id}
              draggable={!saveOrder.isPending}
              onDragStart={(event) => {
                setDraggedId(category.id);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", category.id);
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setDropTargetId(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDropTargetId(category.id);
              }}
              onDragLeave={() =>
                setDropTargetId((current) =>
                  current === category.id ? null : current,
                )
              }
              onDrop={(event) => handleDrop(event, category.id)}
              className={`border-ui-border-base bg-ui-bg-base flex min-w-0 flex-col gap-3 rounded-lg border p-3 transition-shadow sm:flex-row sm:items-center ${
                dropTargetId === category.id && draggedId !== category.id
                  ? "ring-ui-border-interactive ring-2"
                  : ""
              } ${draggedId === category.id ? "opacity-50" : ""}`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className="text-ui-fg-muted cursor-grab touch-none"
                  aria-hidden="true"
                >
                  <BarsThree />
                </span>
                <Text className="w-7 shrink-0 text-center" weight="plus">
                  {index + 1}
                </Text>
                <button
                  type="button"
                  className="min-w-0 text-left"
                  onClick={() => navigate(`/categories/${category.id}`)}
                >
                  <Text weight="plus" className="truncate">
                    {category.name}
                  </Text>
                  <Text size="small" className="text-ui-fg-subtle truncate">
                    /{category.handle}
                  </Text>
                </button>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 pl-14 sm:pl-0">
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  onClick={() => move(category.id, -1)}
                  disabled={index === 0 || saveOrder.isPending}
                  aria-label={`Move ${category.name} up`}
                >
                  <ArrowUpMini /> Move Up
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  onClick={() => move(category.id, 1)}
                  disabled={
                    index === orderedCategories.length - 1 ||
                    saveOrder.isPending
                  }
                  aria-label={`Move ${category.name} down`}
                >
                  <ArrowDownMini /> Move Down
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({});

export default HomepageCategoriesPage;

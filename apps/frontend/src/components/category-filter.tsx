import { eventCategories } from "@repo/areeb-backend/consts/event-categories";
import { useTranslation } from "react-i18next";

interface CategoryFilterProps {
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <label htmlFor="category" className="block text-sm font-medium text-text">
        {t("events.categoryFilterLabel")}
      </label>
      <select
        id="category"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-surface dark:border-divider dark:text-text"
        value={selectedCategory || ""}
        onChange={(e) =>
          onCategoryChange(e.target.value === "" ? undefined : e.target.value)
        }
      >
        <option value="">{t("events.allCategories")}</option>
        {eventCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

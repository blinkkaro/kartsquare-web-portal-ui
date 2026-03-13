import { GET } from "../api";
import { Subcategory } from "./subcategoryInterface";

export const subcategoryService = {
    async getSubcategoriesByCategoryIds(categoryIds: string[]): Promise<Subcategory[]> {
        console.log(categoryIds);
        const response = await GET<Subcategory[]>(`/subcategories`, { category_ids: categoryIds });
        return response.data;
    }
};

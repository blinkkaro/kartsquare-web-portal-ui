import { GET } from "../api";
import { Subcategory } from "./subcategoryInterface";

export const subcategoryService = {
    async getSubcategoriesByCategoryId(categoryId: string): Promise<Subcategory[]> {
        const response = await GET<Subcategory[]>(`/subcategories/${categoryId}/subcategories`);
        return response.data;
    }
};

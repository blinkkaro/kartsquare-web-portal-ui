export interface Subcategory {
    id: string;
    category_id: string;
    name: string;
    description?: string;
    is_deleted: boolean;
    deleted_by?: string | null;
    created_at: string;
    updated_at: string;
    created_by: string;
}

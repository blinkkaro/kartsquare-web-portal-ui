import { useState, useEffect } from "react";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { subcategoryService } from "@/services/subcategory/subcategoryService";
import { userAddressService } from "@/services/userAddress/userAddressService";
import { Category } from "@/services/serviceList/listInteraface";
import { Subcategory } from "@/services/subcategory/subcategoryInterface";
import { UserAddress } from "@/services/userAddress/userAddressInterface";

export const useServiceData = (open: boolean, categoryId: string, selectedAddressId: string) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);

    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
    const [addressesLoading, setAddressesLoading] = useState(false);

    const [error, setError] = useState("");

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const data = await serviceListService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories");
            } finally {
                setCategoriesLoading(false);
            }
        };

        if (open) {
            fetchCategories();
        }
    }, [open]);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setAddressesLoading(true);
                const data = await userAddressService.getUserAddresses();
                setAddresses(data || []);
            } catch (err) {
                console.error("Failed to fetch addresses:", err);
            } finally {
                setAddressesLoading(false);
            }
        };

        if (open) {
            fetchAddresses();
        }
    }, [open]);

    // Fetch subcategories when category changes
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!categoryId) {
                setSubcategories([]);
                return;
            }

            try {
                setSubcategoriesLoading(true);
                const data = await subcategoryService.getSubcategoriesByCategoryId(categoryId);
                setSubcategories(data || []);
            } catch (err) {
                console.error("Failed to fetch subcategories:", err);
                setSubcategories([]);
            } finally {
                setSubcategoriesLoading(false);
            }
        };

        fetchSubcategories();
    }, [categoryId]);

    const refreshAddresses = async () => {
        try {
            const data = await userAddressService.getUserAddresses();
            setAddresses(data || []);
            return data;
        } catch (err) {
            console.error("Failed to refresh addresses:", err);
            return [];
        }
    };

    return {
        categories,
        subcategories,
        addresses,
        categoriesLoading,
        subcategoriesLoading,
        addressesLoading,
        error,
        setError,
        refreshAddresses,
        setSubcategories,
    };
};

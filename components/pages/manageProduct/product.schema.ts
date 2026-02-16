import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";

type TFunction = (key: TranslationKey) => string;

export const productSpecificationSchema = yup.object({
  product_specifications_id: yup.string().required(),
  product_specifications_entered_value: yup
    .array()
    .of(yup.string())
    .default([])
    .test("is-required", "Required", function (value) {
      const {
        product_specifications_is_required,
        product_specifications_name,
      } = this.parent;
      if (!product_specifications_is_required) return true;

      const hasValue =
        value && value.length > 0 && value.some((v) => v && v.trim() !== "");

      if (!hasValue) {
        return this.createError({
          message: `${product_specifications_name} is required`,
        });
      }
      return true;
    }),
  product_specifications_value_type: yup.string().required(),
  product_specifications_is_required: yup.boolean().optional(),
  product_specifications_name: yup.string().optional(),
});

export const productSchema = (t: TFunction) =>
  yup.object({
    product_category_id: yup.string().required(t("productCategoryRequired")),
    product_sub_category_id: yup
      .string()
      .required(t("productSubCategoryRequired")),
    product_brand_id: yup.string().optional(),
    product_name: yup.string().required(t("productNameRequired")),
    sku_number: yup.string().required(t("productSkuRequired")),
    price: yup.number().required(t("productPriceRequired")),
    currency: yup.string().required(t("productCurrencyRequired")),
    product_description: yup.string().required(t("productDescriptionRequired")).min(10, t("productDescriptionMin")),
    product_images: yup.array().required(t("productImagesRequired")).min(1, t("productImagesMin")),
    is_returnable: yup.boolean().required(t("productReturnableRequired")),
    specifications: yup.array().of(productSpecificationSchema).optional(),
    product_origin: yup.string().required(t("productOriginRequired")),    
  });

export type ProductFormValues = yup.InferType<ReturnType<typeof productSchema>>;

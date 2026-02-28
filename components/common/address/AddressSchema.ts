import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";

type TFunction = (key: TranslationKey) => string;

export const createAddressSchema = (t: TFunction) =>
  yup.object({
    address_name: yup.string().trim().required(t("addressNameRequired")),

    address: yup
      .string()
      .trim()
      .max(200, t("addressMax"))
      .required(t("addressRequired")),

    pincode: yup
      .string()
      .trim()
      .matches(/^\d{5,6}$/, t("pincodeInvalid"))
      .required(t("pincodeRequired")),

    city_town: yup
      .string()
      .trim()
      .max(50, t("cityMax"))
      .required(t("cityRequired")),

    state: yup
      .string()
      .trim()
      .max(50, t("stateMax"))
      .required(t("stateRequired")),

    country: yup
      .string()
      .trim()
      .max(50, t("countryMax"))
      .required(t("countryRequired")),

    building_no: yup.string().trim().max(20, t("buildingNoMax")).optional(),

    floor: yup.string().trim().max(10, t("floorMax")).optional(),

    landmark: yup.string().trim().max(100, t("landmarkMax")).optional(),

    is_default: yup.boolean().optional(),
    latitude: yup
      .number()
      .min(-90, "coordinatesInvalid")
      .max(90, "coordinatesInvalid"),
    longitude: yup
      .number()
      .min(-180, "coordinatesInvalid")
      .max(180, "coordinatesInvalid"),
  });

const tempSchema = createAddressSchema((key: string) => key);

export type AddressFormData = yup.InferType<typeof tempSchema>;

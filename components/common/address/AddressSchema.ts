import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";

type TFunction = (key: TranslationKey) => string;

export const createAddressSchema = (t: TFunction) =>
  yup.object({
    address_name: yup.string().required(t("addressNameRequired")),

    address: yup
      .string()
      .max(200, t("addressMax"))
      .required(t("addressRequired")),

    pincode: yup
      .string()
      .matches(/^\d{5,6}$/, t("pincodeInvalid"))
      .required(t("pincodeRequired")),

    city_town: yup.string().max(50, t("cityMax")).required(t("cityRequired")),

    state: yup.string().max(50, t("stateMax")).required(t("stateRequired")),

    country: yup
      .string()
      .max(50, t("countryMax"))
      .required(t("countryRequired")),

    building_no: yup.string().max(20, t("buildingNoMax")).optional(),

    floor: yup.string().max(10, t("floorMax")).optional(),

    landmark: yup.string().max(100, t("landmarkMax")).optional(),

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

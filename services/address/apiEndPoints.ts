export const APIENDPOINTS = {
    GET_ADDRESS: "/user/addresses/getUserAddresses",
    ADD_ADDRESS: "/user/addresses/createAddress",
    UPDATE_ADDRESS: (id: string) => `/user/addresses/updateAddress/${id}`,
    DELETE_ADDRESS: (id: string) => `/user/addresses/deleteAddress/${id}`
}
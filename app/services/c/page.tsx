import { permanentRedirect } from "next/navigation";

/** /services/c on its own is not a page. Send it to the hub rather than the legacy slug route. */
export default function CategoryIndexRedirect() {
  permanentRedirect("/explore-services");
}

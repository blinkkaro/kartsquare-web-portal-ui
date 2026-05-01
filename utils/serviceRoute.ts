type ServiceRouteCandidate = {
  slug?: string | null;
  service_id?: string | null;
  id?: string | null;
};

export function getServiceRouteParam(service: ServiceRouteCandidate): string {
  const slug = service.slug?.trim();
  if (slug) return slug;
  return service.service_id || service.id || "";
}

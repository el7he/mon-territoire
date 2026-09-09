import { useState, useEffect } from "react";
import { searchByCommunes, type CommuneRecord } from "../api/annuaire";

export function useServices(codeInsee?: string) {
  const [services, setServices] = useState<CommuneRecord[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesLimit, setServicesLimit] = useState<number>(20);
  const [servicesOffset, setServicesOffset] = useState<number>(0);
  const [totalServices, setTotalServices] = useState<number>(0);

  useEffect(() => {
    if (!codeInsee) return;
    const controller = new AbortController();
    setLoadingServices(true);

    searchByCommunes(codeInsee, {
      limit: servicesLimit,
      offset: servicesOffset,
      signal: controller.signal,
    })
      .then((res) => {
        setServices(res.records);
        setTotalServices(res.totalCount);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setServices([]);
          setTotalServices(0);
        }
      })
      .finally(() => setLoadingServices(false));

    return () => controller.abort();
  }, [codeInsee, servicesLimit, servicesOffset]);

  return {
    services,
    loadingServices,
    servicesLimit,
    setServicesLimit,
    servicesOffset,
    setServicesOffset,
    totalServices,
  };
}

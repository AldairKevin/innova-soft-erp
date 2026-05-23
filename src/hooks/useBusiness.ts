"use client";

import { useEffect, useState } from "react";

type Business = {
  id: number;
  name: string;
  ruc?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
};

export function useBusiness() {
  const [business, setBusiness] =
    useState<Business | null>(null);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await fetch("/api/business");

      const data = await res.json();

      setBusiness(data);
    } catch (error) {
      console.error(error);
    }
  };

  return business;
}
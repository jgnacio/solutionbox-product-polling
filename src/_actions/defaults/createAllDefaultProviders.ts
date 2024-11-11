import { defaultProviders } from "../../API/defaults";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createProvider = (
  name: string,
  contact: string,
  direction: string,
  logoUrl: string,
  mainPageUrl: string,
  searchPageUrl: string
) => {
  const provider = prisma.provider.create({
    data: {
      name,
      contact,
      direction,
      logoUrl,
      mainPageUrl,
      searchPageUrl,
    },
  });
  return provider;
};

export default async function createAllDefaultProviders() {
  const providers = defaultProviders.map((provider) => {
    return createProvider(
      provider.name,
      provider.contact,
      provider.direction,
      provider.logoUrl,
      provider.mainPageUrl,
      provider.searchPageUrl
    );
  });
  await Promise.all(providers);
  console.log("Providers created successfully");
  console.log("Providers:", providers);
}

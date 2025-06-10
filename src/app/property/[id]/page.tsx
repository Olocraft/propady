import { DynamicPage } from "./_components/DynamicPage";
import { getProperty } from "@/lib/actions/get-dynamic-property";

type Param = {
  params: Promise<{ id: string }>;
};

const PropertyPage = async ({ params }: Param) => {
  const { id } = await params;

  const getDynamicProperty = await getProperty(id);

  return <DynamicPage property={getDynamicProperty.property!} />;
};

export default PropertyPage;

import { useEffect } from "react";
import { VStack, HStack } from "@chakra-ui/react";

import ActionButton from "~/components/ActionButton";
import DeleteButton from "./DeleteButton";
import FineTuneButton from "./FineTuneButton";
import UploadDataButton from "./UploadDataButton";
import DatasetEntriesTable from "./DatasetEntriesTable/DatasetEntriesTable";
import DatasetEntryPaginator from "./DatasetEntryPaginator";
import { FiFilter } from "react-icons/fi";
import GeneralFilters from "./GeneralFilters";
import { useFilters } from "~/components/Filters/useFilters";
import RelabelButton from "./RelabelButton";

const General = () => {
  const filters = useFilters().filters;
  const filtersShown = useFilters().filtersShown;
  const setFiltersShown = useFilters().setFiltersShown;

  useEffect(() => {
    if (filters.length) setFiltersShown(true);
  }, [filters.length, setFiltersShown]);

  return (
    <VStack pb={8} px={8} alignItems="flex-start" spacing={4} w="full">
      <HStack w="full" justifyContent="flex-end">
        <FineTuneButton />
        <UploadDataButton />
        <ActionButton
          onClick={() => {
            setFiltersShown(!filtersShown);
          }}
          label={filtersShown ? "Hide Filters" : "Show Filters"}
          icon={FiFilter}
        />
        <RelabelButton />
        <DeleteButton />
      </HStack>
      {filtersShown && <GeneralFilters />}
      <DatasetEntriesTable />
      <DatasetEntryPaginator />
    </VStack>
  );
};

export default General;

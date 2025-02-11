import { useMemo, useRef, useState, useLayoutEffect } from "react";
import type { DatasetEval } from "@prisma/client";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import { isNumber } from "lodash-es";
import { FiChevronDown, FiEdit2 } from "react-icons/fi";
import { FaArrowDown, FaArrowUp, FaEyeSlash } from "react-icons/fa";

import { useModelTestingStats, useDataset } from "~/utils/hooks";
import ColoredPercent from "~/components/ColoredPercent";
import { useAppStore } from "~/state/store";
import { useVisibleEvalIds } from "../useVisibleEvalIds";
import { useTestEntrySortOrder } from "../useTestEntrySortOrder";
import { SortOrder } from "~/types/shared.types";

const EvalHeaderPill = ({
  datasetEval,
  modelId,
}: {
  datasetEval: DatasetEval;
  modelId: string;
}) => {
  const dataset = useDataset().data;
  const stats = useModelTestingStats(dataset?.id, modelId).data;
  const setDatasetEvalIdToEdit = useAppStore(
    (state) => state.evaluationsSlice.setDatasetEvalIdToEdit,
  );
  const toggleEvalVisiblity = useVisibleEvalIds().toggleEvalVisiblity;

  const { testEntrySortOrder, setTestEntrySortOrder } = useTestEntrySortOrder();

  const [isSortingAscending, isSortingDescending] = useMemo(() => {
    if (testEntrySortOrder?.modelId !== modelId || testEntrySortOrder?.evalId !== datasetEval.id) {
      return [false, false];
    }
    return [
      testEntrySortOrder.order === SortOrder.ASC,
      testEntrySortOrder.order === SortOrder.DESC,
    ];
  }, [testEntrySortOrder, modelId, datasetEval]);

  const score = useMemo(() => {
    if (!stats?.averageScores || !(datasetEval.id in stats?.averageScores)) return null;
    return stats.averageScores[datasetEval.id];
  }, [stats?.averageScores, datasetEval]);

  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  useLayoutEffect(() => {
    if (!buttonRef.current) return;
    setButtonWidth(buttonRef.current.offsetWidth);
  }, [buttonRef, setButtonWidth]);

  if (!isNumber(score)) return null;

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box>
          <HStack
            ref={buttonRef}
            fontSize="xs"
            borderRadius={8}
            borderWidth={1}
            _hover={{ backgroundColor: "gray.100" }}
            borderColor="gray.300"
            h={6}
            px={2}
            spacing={1}
            cursor="pointer"
          >
            <Text fontWeight="bold" color="gray.500">
              {datasetEval.name}
            </Text>
            <ColoredPercent value={score} />
            {isSortingAscending && <Icon as={FaArrowUp} boxSize={3} strokeWidth={2} />}
            {isSortingDescending && <Icon as={FaArrowDown} boxSize={3} strokeWidth={2} />}
            <Icon as={FiChevronDown} boxSize={3} strokeWidth={2} />
          </HStack>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        boxShadow="0 0 40px 4px rgba(0, 0, 0, 0.1);"
        minW={buttonWidth}
        w="auto"
        mt={-1}
      >
        <VStack w="full" spacing={0}>
          <HStack
            as={Button}
            w="full"
            colorScheme="blue"
            color="gray.500"
            variant="ghost"
            justifyContent="space-between"
            h={8}
            px={2}
            onClick={() => {
              if (isSortingAscending) {
                setTestEntrySortOrder(null);
              } else {
                setTestEntrySortOrder({ modelId, evalId: datasetEval.id, order: SortOrder.ASC });
              }
            }}
            borderRadius={0}
            borderBottomWidth={1}
          >
            <Text fontSize="xs">Sort Ascending</Text>
            <HStack>
              <Icon as={FaArrowUp} color={isSortingAscending ? "blue.500" : "gray.500"} />
            </HStack>
          </HStack>
          <HStack
            as={Button}
            w="full"
            colorScheme="blue"
            color="gray.500"
            variant="ghost"
            justifyContent="space-between"
            h={8}
            px={2}
            onClick={() => {
              if (isSortingDescending) {
                setTestEntrySortOrder(null);
              } else {
                setTestEntrySortOrder({ modelId, evalId: datasetEval.id, order: SortOrder.DESC });
              }
            }}
            borderRadius={0}
            borderBottomWidth={1}
          >
            <Text fontSize="xs">Sort Descending</Text>
            <HStack>
              <Icon as={FaArrowDown} color={isSortingDescending ? "blue.500" : "gray.500"} />
            </HStack>
          </HStack>
          {datasetEval.type !== "FIELD_COMPARISON" && (
            <HStack
              as={Button}
              w="full"
              colorScheme="blue"
              color="gray.500"
              variant="ghost"
              justifyContent="space-between"
              h={8}
              px={2}
              onClick={() => setDatasetEvalIdToEdit(datasetEval.id)}
              borderRadius={0}
              borderBottomWidth={1}
            >
              <Text fontSize="xs">Edit Eval</Text>
              <Icon as={FiEdit2} color="gray.500" />
            </HStack>
          )}
          <HStack
            as={Button}
            w="full"
            colorScheme="blue"
            color="gray.500"
            variant="ghost"
            justifyContent="space-between"
            h={8}
            px={2}
            onClick={() => toggleEvalVisiblity(datasetEval.id)}
            borderRadius={0}
            borderBottomWidth={1}
          >
            <Text fontSize="xs">Hide Eval</Text>
            <Icon as={FaEyeSlash} color="gray.500" />
          </HStack>
        </VStack>
      </PopoverContent>
    </Popover>
  );
};

export default EvalHeaderPill;

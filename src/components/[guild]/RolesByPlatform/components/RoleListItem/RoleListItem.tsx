import {
  Button,
  Collapse,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementCard from "components/[guild]/RequirementCard"
import useLevelsAccess from "components/[guild]/RolesByPlatform/components/JoinButton/hooks/useLevelsAccess"
import useRequirementLabels from "hooks/useRequirementLabels"
import { CaretDown, CaretUp, Check, X } from "phosphor-react"
import React, { useState } from "react"
import { Role } from "temporaryData/types"
import AccessIndicator from "./components/AccessIndicator"

type Props = {
  roleData: Role
}

const RoleListItem = ({ roleData }: Props): JSX.Element => {
  const { hasAccess, error, isLoading } = useLevelsAccess([roleData.id])
  const requirements = useRequirementLabels(roleData.requirements)
  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={6}
      py={{ base: 5, md: 7 }}
      width="full"
    >
      <SimpleGrid
        width="full"
        templateColumns={{ base: "1fr auto", md: "auto 1fr" }}
        columnGap={{ base: 4, sm: 6 }}
        alignItems="start"
      >
        <GridItem order={{ md: 1 }}>
          <Wrap alignItems="center" spacing={2} mb={3}>
            <Heading size="md" fontFamily="display">
              {roleData.name}
            </Heading>
            <Text
              as="span"
              colorScheme="gray"
              fontSize="sm"
              position="relative"
              top={1}
            >{`${roleData.members?.length || 0} members`}</Text>
          </Wrap>

          <Wrap zIndex="1">
            {requirements?.split(", ").map((requirement) => (
              <Tag key={requirement} as="li">
                {requirement}
              </Tag>
            ))}
            <Button
              key="details"
              variant="outline"
              rightIcon={<Icon as={isRequirementsExpanded ? CaretUp : CaretDown} />}
              size="xs"
              rounded="md"
              onClick={() => setIsRequirementsExpanded(!isRequirementsExpanded)}
            >
              {isRequirementsExpanded ? "Close details" : "View details"}
            </Button>
          </Wrap>
        </GridItem>

        <GridItem order={{ md: 0 }} mt="1">
          <GuildLogo imageUrl={roleData.imageUrl} size={14} iconSize={4} />
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={2}>
          {roleData.description && <Text mt={6}>{roleData.description}</Text>}

          <Collapse in={isRequirementsExpanded} animateOpacity>
            <VStack maxW="md" mt={6}>
              {roleData.requirements?.map((requirement, i) => (
                <React.Fragment key={i}>
                  <RequirementCard requirement={requirement} boxShadow="none" />
                  {i < roleData.requirements.length - 1 && (
                    <LogicDivider logic={roleData.logic} />
                  )}
                </React.Fragment>
              ))}
            </VStack>
          </Collapse>
        </GridItem>
      </SimpleGrid>

      {!error &&
        (hasAccess ? (
          <AccessIndicator
            label="You have access"
            icon={Check}
            colorScheme="green"
          />
        ) : isLoading ? (
          <AccessIndicator label="Checking access" icon={Spinner} />
        ) : (
          <AccessIndicator label="No access" icon={X} />
        ))}
    </Stack>
  )
}

export default RoleListItem
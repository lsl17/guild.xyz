import { useDisclosure } from "@chakra-ui/react"
import DiscardAlert from "components/common/DiscardAlert"
import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react"
import { PlatformName } from "types"

type AddPlatformStep = "HOME" | "SELECT_ROLE"

export enum RoleTypeToAddTo {
  EXISTING_ROLE,
  NEW_ROLE,
}

const AddRewardContext = createContext<{
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  modalRef: MutableRefObject<any>
  scrollToTop: () => void
  selection: PlatformName
  setSelection: (newSelection: PlatformName) => void
  step: AddPlatformStep
  setStep: (newStep: AddPlatformStep) => void
  activeTab: RoleTypeToAddTo
  setActiveTab: Dispatch<SetStateAction<RoleTypeToAddTo>>
  shouldShowCloseAlert: boolean
  setShouldShowCloseAlert: Dispatch<SetStateAction<boolean>>
  isBackButtonDisabled: boolean
  setIsBackButtonDisabled: Dispatch<SetStateAction<boolean>>
}>(undefined)

const AddRewardProvider = ({ children }: PropsWithChildren<unknown>) => {
  const modalRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const scrollToTop = () => modalRef.current?.scrollTo({ top: 0 })

  const [selection, setSelectionOg] = useState<PlatformName>()

  const setSelection = (newSelection: PlatformName) => {
    setSelectionOg(newSelection)
    scrollToTop()
  }

  const [step, setStepOg] = useState<AddPlatformStep>()

  const setStep = (newStep: AddPlatformStep) => {
    setStepOg(newStep)
    scrollToTop()
  }

  const [activeTab, setActiveTab] = useState<RoleTypeToAddTo>(
    RoleTypeToAddTo.EXISTING_ROLE
  )

  const [shouldShowCloseAlert, setShouldShowCloseAlert] = useState(false)
  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false)

  return (
    <AddRewardContext.Provider
      value={{
        modalRef,
        isOpen,
        onOpen: () => {
          setSelection(null)
          setStep("HOME")
          onOpen()
        },
        onClose: () => {
          if (shouldShowCloseAlert) {
            onDiscardAlertOpen()
            return
          }

          onClose()
          setShouldShowCloseAlert(false)
          setIsBackButtonDisabled(false)
        },
        scrollToTop,
        selection,
        setSelection,
        step,
        setStep,
        activeTab,
        setActiveTab,
        shouldShowCloseAlert,
        setShouldShowCloseAlert,
        isBackButtonDisabled,
        setIsBackButtonDisabled,
      }}
    >
      {children}
      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={onClose}
      />
    </AddRewardContext.Provider>
  )
}

const useAddRewardContext = () => useContext(AddRewardContext)

export { AddRewardProvider, useAddRewardContext }
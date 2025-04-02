import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  ListItem,
  List,
  ListIcon,
} from '@chakra-ui/react'
import { CheckCircle } from 'react-feather'

type Props = {
  isOpen: boolean
  onClose: () => void
}

function About({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About </ModalHeader>
        <ModalCloseButton />
        <ModalBody>

        </ModalBody>

        <ModalFooter>
          <Button size="lg" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default About

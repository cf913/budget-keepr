import { toast } from '@backpackapp-io/react-native-toast'

const success = (message: string) => {
  return toast.success(message)
}

const error = (message: string) => {
  return toast.error(message)
}

const Toasty = { success, error }

export default Toasty

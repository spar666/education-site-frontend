import { useRouter } from 'next/navigation'
import { notification } from 'antd'

export const useAuth = () => {
  const router = useRouter()

  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!res.ok) throw new Error()

      notification.success({message:'Signed out successfully'})

      router.push('/sign-in')
      router.refresh()
    } catch (err) {
      notification.error({message:"Couldn't sign out, please try again."})
    }
  }

  return { signOut }
}

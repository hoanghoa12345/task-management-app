import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"
 
export default function SignOutPage() {
  return (
    <div>
      <h5>Are you sure you want to sign out?</h5>
      <form
        action={async (formData) => {
          "use server"
          await signOut({redirectTo: '/', redirect: true})
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  )
}
import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'

export default function NotFound() {
  return (
    <div className="py-8">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="That route does not exist. Use the navigation to return to your dashboard or the curriculum."
        action={
          <Link to="/" className="btn-primary">
            Back to dashboard
          </Link>
        }
      />
    </div>
  )
}

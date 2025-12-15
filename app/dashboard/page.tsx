import { LogoutButton } from "../components/forms/logout-button";


export default function Dashboard() {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1>Dashboard</h1>
                <LogoutButton />
            </div>
        </div>
    )
}
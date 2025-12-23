import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/app/components/ui/card"

interface AuthFormProps {
    title: string;
    description: string;
    children: React.ReactNode;
}


export const AuthFormContainer = ({ title, description, children}: AuthFormProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

export default AuthFormContainer;